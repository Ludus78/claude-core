-- =====================================================================
-- SéanceClub : schéma PostgreSQL v1 (PostgreSQL 14+)
-- Pas de rencontres IRL dans cette version.
-- Séances réservées aux majeurs. Moins de 15 ans : accord parental requis.
-- =====================================================================
CREATE EXTENSION IF NOT EXISTS citext;

-- ---------------------------------------------------------------------
-- 1. UTILISATEURS
-- ---------------------------------------------------------------------
-- Inscription : refusée sous 13 ans (trigger plus bas). Entre 13 et 14 ans, le compte
-- reste 'pending_parental' tant que l'accord d'un parent n'est pas validé.
CREATE TABLE users (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                citext NOT NULL UNIQUE,
  pseudo               citext NOT NULL UNIQUE CHECK (pseudo ~ '^[A-Za-z0-9_.-]{3,20}$'),
  birth_date           date NOT NULL,
  avatar_url           text,
  plan                 text NOT NULL DEFAULT 'free' CHECK (plan IN ('free','premium')),
  consent_at           timestamptz NOT NULL,
  account_status       text NOT NULL DEFAULT 'active'
                       CHECK (account_status IN ('active','pending_parental','suspended')),
  created_at           timestamptz NOT NULL DEFAULT now()
);
-- Les tables accounts / sessions d'Auth.js sont créées par son adaptateur.

-- Âge calculé à la volée (jamais stocké : il change chaque année)
CREATE FUNCTION user_age(p_birth date) RETURNS int
LANGUAGE sql STABLE AS $$ SELECT date_part('year', age(CURRENT_DATE, p_birth))::int $$;

-- La date de naissance ne peut pas être modifiée par l'utilisateur
-- (correction possible uniquement par le support, en désactivant ce trigger).
CREATE FUNCTION lock_birth_date() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.birth_date <> OLD.birth_date THEN
    RAISE EXCEPTION 'birth_date_locked';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_lock_birth_date BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION lock_birth_date();

-- Inscription refusée sous 13 ans
CREATE FUNCTION check_signup_age() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF user_age(NEW.birth_date) < 13 THEN
    RAISE EXCEPTION 'too_young';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_signup_age BEFORE INSERT ON users
FOR EACH ROW EXECUTE FUNCTION check_signup_age();

-- Accord parental (moins de 15 ans).
-- À la création du compte : account_status = 'pending_parental' + une ligne ici.
-- Quand status passe à 'approved', l'API repasse le compte en 'active'.
-- Minimisation RGPD : ne garde pas les pièces d'identité du parent. Après validation,
-- supprime le justificatif (document_ref = NULL) et garde seulement la trace de l'accord.
CREATE TABLE parental_consents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_email  citext NOT NULL,
  method        text NOT NULL CHECK (method IN ('email_link','document')),
  token_hash    text,                       -- lien de confirmation envoyé au parent
  document_ref  text,                       -- chemin du justificatif, supprimé après validation
  status        text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','approved','rejected','expired')),
  requested_at  timestamptz NOT NULL DEFAULT now(),
  expires_at    timestamptz NOT NULL DEFAULT now() + interval '14 days',
  decided_at    timestamptz,
  reviewed_by   uuid REFERENCES users(id)   -- modérateur, si méthode 'document'
);
CREATE INDEX idx_parental_user ON parental_consents (user_id, status);

-- ---------------------------------------------------------------------
-- 2. FILMS (cache local de l'API) + RESTRICTION D'ÂGE
-- ---------------------------------------------------------------------
CREATE TABLE films (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tmdb_id            int UNIQUE,
  imdb_id            text UNIQUE,
  title              text NOT NULL,
  original_title     text,
  year               smallint,
  release_date       date,
  runtime_min        smallint,
  poster_path        text,
  synopsis           text,
  country            text,
  language           text,
  -- Classification française : 0 = tous publics, 10, 12, 16, 18.
  -- min_age : récupéré automatiquement depuis TMDB (release_dates, pays FR ; "U" = 0).
  -- NULL = absente sur TMDB.
  min_age               smallint CHECK (min_age IN (0,10,12,16,18)),
  -- min_age_override : saisie manuelle (donnée absente ou classification modifiée).
  -- Prioritaire sur min_age, et jamais écrasée par les mises à jour automatiques.
  min_age_override      smallint CHECK (min_age_override IN (0,10,12,16,18)),
  age_rating_checked_at timestamptz,
  is_adult              boolean NOT NULL DEFAULT false,   -- drapeau "adulte" de l'API
  -- Âge minimum effectif : adulte = 18 ; sinon override > TMDB > 16 par prudence
  effective_min_age     smallint GENERATED ALWAYS AS (
                          CASE WHEN is_adult THEN 18
                               ELSE COALESCE(min_age_override, min_age, 16) END
                        ) STORED,
  cached_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_films_age ON films (effective_min_age);
CREATE INDEX idx_films_release ON films (release_date);

CREATE TABLE genres (
  id    serial PRIMARY KEY,
  name  text NOT NULL UNIQUE
);
CREATE TABLE film_genres (
  film_id   uuid REFERENCES films(id) ON DELETE CASCADE,
  genre_id  int  REFERENCES genres(id),
  PRIMARY KEY (film_id, genre_id)
);

-- Films accessibles à un utilisateur : à utiliser pour la recherche, l'accueil,
-- les recommandations, le calendrier des sorties et les listes.
CREATE FUNCTION films_for_user(p_user uuid) RETURNS SETOF films
LANGUAGE sql STABLE AS $$
  SELECT f.* FROM films f
  JOIN users u ON u.id = p_user
  WHERE f.effective_min_age <= user_age(u.birth_date)
$$;

-- Garde-fou : bloque toute action d'un mineur sur un film interdit pour son âge
-- (seconde barrière, au cas où l'API oublierait de filtrer).
CREATE FUNCTION check_film_age() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE v_user uuid; v_birth date; v_min smallint;
BEGIN
  v_user := COALESCE(to_jsonb(NEW)->>'user_id', to_jsonb(NEW)->>'host_id')::uuid;
  SELECT birth_date INTO v_birth FROM users WHERE id = v_user;
  SELECT effective_min_age INTO v_min FROM films WHERE id = NEW.film_id;
  IF user_age(v_birth) < v_min THEN
    RAISE EXCEPTION 'film_age_restricted';
  END IF;
  RETURN NEW;
END $$;

-- ---------------------------------------------------------------------
-- 3. RAPPORT AUX FILMS (cœur du score cinéphile)
-- ---------------------------------------------------------------------
CREATE TABLE user_films (
  user_id      uuid REFERENCES users(id) ON DELETE CASCADE,
  film_id      uuid REFERENCES films(id),
  status       text NOT NULL CHECK (status IN ('seen','watchlist')),
  rating       numeric(2,1) CHECK (rating BETWEEN 0.5 AND 5 AND rating * 2 = floor(rating * 2)),
  is_favorite  boolean NOT NULL DEFAULT false,
  seen_at      date,
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, film_id)
);
CREATE INDEX idx_user_films_film ON user_films (film_id);
CREATE TRIGGER trg_age_user_films BEFORE INSERT ON user_films
FOR EACH ROW EXECUTE FUNCTION check_film_age();

-- ---------------------------------------------------------------------
-- 4. AVIS, DÉBATS, GROUPES
-- ---------------------------------------------------------------------
CREATE TABLE reviews (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  film_id      uuid NOT NULL REFERENCES films(id),
  rating       numeric(2,1) NOT NULL CHECK (rating BETWEEN 0.5 AND 5 AND rating * 2 = floor(rating * 2)),
  body         text CHECK (char_length(body) <= 2000),
  has_spoiler  boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, film_id)
);
CREATE INDEX idx_reviews_film ON reviews (film_id, created_at DESC);
CREATE TRIGGER trg_age_reviews BEFORE INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION check_film_age();

CREATE TABLE review_likes (
  review_id  uuid REFERENCES reviews(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (review_id, user_id)
);

-- Débat "Ce film est-il OK ou pas ?"
CREATE TABLE film_votes (
  user_id  uuid REFERENCES users(id) ON DELETE CASCADE,
  film_id  uuid REFERENCES films(id),
  vote     text NOT NULL CHECK (vote IN ('ok','not_ok')),
  PRIMARY KEY (user_id, film_id)
);
CREATE TRIGGER trg_age_votes BEFORE INSERT ON film_votes
FOR EACH ROW EXECUTE FUNCTION check_film_age();

-- Groupes de vision ("mon groupe") : la note de groupe = moyenne des notes des membres
CREATE TABLE groups (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  audience    text NOT NULL CHECK (audience IN ('adult','minor')),  -- pas de groupe mixte
  owner_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE group_members (
  group_id  uuid REFERENCES groups(id) ON DELETE CASCADE,
  user_id   uuid REFERENCES users(id) ON DELETE CASCADE,
  role      text NOT NULL DEFAULT 'member' CHECK (role IN ('owner','member')),
  PRIMARY KEY (group_id, user_id)
);
-- Un groupe est soit 100 % majeurs, soit 100 % mineurs.
-- (Prévoir une tâche quotidienne pour les mineurs qui passent 18 ans.)
CREATE FUNCTION check_group_audience() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE v_aud text; v_birth date;
BEGIN
  SELECT audience INTO v_aud FROM groups WHERE id = NEW.group_id;
  SELECT birth_date INTO v_birth FROM users WHERE id = NEW.user_id;
  IF (user_age(v_birth) >= 18) <> (v_aud = 'adult') THEN
    RAISE EXCEPTION 'group_audience_mismatch';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_group_audience BEFORE INSERT ON group_members
FOR EACH ROW EXECUTE FUNCTION check_group_audience();

-- ---------------------------------------------------------------------
-- 5. LISTES ET TIER LISTS
-- ---------------------------------------------------------------------
CREATE TABLE lists (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  type        text NOT NULL DEFAULT 'list' CHECK (type IN ('list','tierlist')),
  is_public   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE list_items (
  list_id   uuid REFERENCES lists(id) ON DELETE CASCADE,
  film_id   uuid REFERENCES films(id),
  position  int NOT NULL DEFAULT 0,
  tier      text CHECK (tier IN ('S','A','B','C','D')),
  PRIMARY KEY (list_id, film_id)
);
-- Listes publiques : l'API filtre les films avec films_for_user() pour chaque lecteur.

-- ---------------------------------------------------------------------
-- 6. SORTIES ET ALERTES AGENDA
-- ---------------------------------------------------------------------
CREATE TABLE film_alerts (
  user_id     uuid REFERENCES users(id) ON DELETE CASCADE,
  film_id     uuid REFERENCES films(id),
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, film_id)
);
CREATE TRIGGER trg_age_alerts BEFORE INSERT ON film_alerts
FOR EACH ROW EXECUTE FUNCTION check_film_age();

-- ---------------------------------------------------------------------
-- 7. SÉANCES (watch parties) ET CHAT : RÉSERVÉES AUX MAJEURS
-- ---------------------------------------------------------------------
CREATE TABLE screenings (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id           uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  film_id           uuid NOT NULL REFERENCES films(id),
  title             text,
  starts_at         timestamptz NOT NULL,
  visibility        text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','private')),
  invite_code       text UNIQUE,
  max_participants  int NOT NULL DEFAULT 50,
  status            text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','live','ended')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  CHECK (visibility = 'public' OR invite_code IS NOT NULL)
);
CREATE INDEX idx_screenings_start ON screenings (status, starts_at);

CREATE TABLE screening_members (
  screening_id  uuid REFERENCES screenings(id) ON DELETE CASCADE,
  user_id       uuid REFERENCES users(id) ON DELETE CASCADE,
  is_ready      boolean NOT NULL DEFAULT false,
  joined_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (screening_id, user_id)
);

-- Séances et chat : réservés aux majeurs (hôte, participants, auteurs de messages)
CREATE FUNCTION require_adult() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE v_user uuid; v_birth date;
BEGIN
  v_user := COALESCE(to_jsonb(NEW)->>'user_id', to_jsonb(NEW)->>'host_id')::uuid;
  IF v_user IS NULL THEN RETURN NEW; END IF;   -- messages système
  SELECT birth_date INTO v_birth FROM users WHERE id = v_user;
  IF v_birth IS NULL OR user_age(v_birth) < 18 THEN
    RAISE EXCEPTION 'adults_only';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_adult_screenings BEFORE INSERT ON screenings
FOR EACH ROW EXECUTE FUNCTION require_adult();
CREATE TRIGGER trg_adult_screening_members BEFORE INSERT ON screening_members
FOR EACH ROW EXECUTE FUNCTION require_adult();

CREATE TABLE chat_messages (
  id            bigserial PRIMARY KEY,
  screening_id  uuid NOT NULL REFERENCES screenings(id) ON DELETE CASCADE,
  user_id       uuid REFERENCES users(id) ON DELETE SET NULL,
  body          text NOT NULL CHECK (char_length(body) <= 500),
  kind          text NOT NULL DEFAULT 'message' CHECK (kind IN ('message','system','spoiler')),
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_chat_screening ON chat_messages (screening_id, created_at);
CREATE TRIGGER trg_adult_chat BEFORE INSERT ON chat_messages
FOR EACH ROW EXECUTE FUNCTION require_adult();
-- RGPD : prévoir une tâche planifiée qui supprime les messages après X jours
-- (ex. DELETE FROM chat_messages WHERE created_at < now() - interval '30 days').

-- ---------------------------------------------------------------------
-- 8. SCORE CINÉPHILE ET BADGES
-- ---------------------------------------------------------------------
CREATE TABLE user_stats (
  user_id          uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  films_seen       int NOT NULL DEFAULT 0,
  minutes_watched  int NOT NULL DEFAULT 0,
  diversity_score  smallint NOT NULL DEFAULT 0 CHECK (diversity_score BETWEEN 0 AND 100),
  reference_score  smallint NOT NULL DEFAULT 0 CHECK (reference_score BETWEEN 0 AND 100),
  score            smallint NOT NULL DEFAULT 0,
  level            text NOT NULL DEFAULT 'curieux',
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE badges (
  id           serial PRIMARY KEY,
  code         text NOT NULL UNIQUE,
  name         text NOT NULL,
  description  text
);
CREATE TABLE user_badges (
  user_id     uuid REFERENCES users(id) ON DELETE CASCADE,
  badge_id    int  REFERENCES badges(id),
  earned_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);
-- Listes de films "essentiels" qui alimentent le score de références
CREATE TABLE reference_lists (
  id    serial PRIMARY KEY,
  name  text NOT NULL
);
CREATE TABLE reference_list_films (
  reference_list_id  int  REFERENCES reference_lists(id) ON DELETE CASCADE,
  film_id            uuid REFERENCES films(id),
  PRIMARY KEY (reference_list_id, film_id)
);
-- Défis : les films -16/-18 comptent dans le score des adultes ; pour un mineur,
-- le calcul du score ignore les films au-dessus de son âge.

-- ---------------------------------------------------------------------
-- 9. PREMIUM ET MODÉRATION
-- ---------------------------------------------------------------------
CREATE TABLE subscriptions (
  user_id               uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id    text NOT NULL UNIQUE,
  stripe_subscription_id text UNIQUE,
  status                text NOT NULL,
  current_period_end    timestamptz
);
CREATE TABLE reports (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id  uuid REFERENCES users(id) ON DELETE SET NULL,
  target_type  text NOT NULL CHECK (target_type IN ('review','chat_message','user','screening')),
  target_id    text NOT NULL,
  reason       text NOT NULL,
  status       text NOT NULL DEFAULT 'open' CHECK (status IN ('open','handled','dismissed')),
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE bans (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason      text,
  expires_at  timestamptz,          -- NULL = définitif
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 10. AJOUTS POUR LA SPÉCIFICATION DU SCORE (formule v1)
-- ---------------------------------------------------------------------
ALTER TABLE user_stats
  ADD COLUMN volume_score smallint NOT NULL DEFAULT 0 CHECK (volume_score BETWEEN 0 AND 100),
  ADD COLUMN score_version int NOT NULL DEFAULT 1;
ALTER TABLE reference_lists ADD COLUMN version int NOT NULL DEFAULT 1;

-- Rattache chaque genre de l'API à l'une des 10 familles de genres
CREATE TABLE genre_families (
  genre_id  int PRIMARY KEY REFERENCES genres(id),
  family    text NOT NULL CHECK (family IN (
    'action_aventure','animation','comedie','crime_thriller','documentaire',
    'drame','fantasy_sf','horreur','romance','histoire_guerre'))
);
-- Rattache chaque pays (code ISO) à l'une des 5 régions
CREATE TABLE country_regions (
  country_code  char(2) PRIMARY KEY,
  region        text NOT NULL CHECK (region IN ('hollywood','france','europe','asie','monde'))
);
