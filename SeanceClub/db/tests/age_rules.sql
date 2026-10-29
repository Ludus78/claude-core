-- Tests des règles d'âge. À lancer sur une base JETABLE où 001_init.sql est appliqué :
--   createdb seanceclub_test && psql -d seanceclub_test -f db/migrations/001_init.sql
--   psql -q -d seanceclub_test -f db/tests/age_rules.sql
-- Résultat attendu : 0 FAIL.
\set ON_ERROR_STOP 0
CREATE TEMP TABLE results(name text, ok boolean);
CREATE FUNCTION pg_temp.expect_err(p_name text, p_sql text, p_msg text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  BEGIN EXECUTE p_sql; INSERT INTO results VALUES (p_name, false);
  EXCEPTION WHEN OTHERS THEN INSERT INTO results VALUES (p_name, SQLERRM = p_msg); END;
END $$;
CREATE FUNCTION pg_temp.expect_ok(p_name text, p_sql text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  BEGIN EXECUTE p_sql; INSERT INTO results VALUES (p_name, true);
  EXCEPTION WHEN OTHERS THEN INSERT INTO results VALUES (p_name || ' [' || SQLERRM || ']', false); END;
END $$;

INSERT INTO users(id,email,pseudo,birth_date,consent_at) VALUES
 ('00000000-0000-0000-0000-0000000000a1','adult@x.fr','adulte','1990-05-01',now()),
 ('00000000-0000-0000-0000-0000000000b1','teen16@x.fr','ado16','2010-01-01',now()),
 ('00000000-0000-0000-0000-0000000000c1','teen13@x.fr','ado13','2013-01-01',now());
SELECT pg_temp.expect_err('inscription 12 ans refusée',
 $q$INSERT INTO users(email,pseudo,birth_date,consent_at) VALUES ('k@x.fr','kid12','2014-06-01',now())$q$, 'too_young');

INSERT INTO films(id,title,min_age,is_adult,min_age_override) VALUES
 ('10000000-0000-0000-0000-000000000001','Tous publics',0,false,NULL),
 ('10000000-0000-0000-0000-000000000016','Moins de 16',16,false,NULL),
 ('10000000-0000-0000-0000-000000000018','Moins de 18',18,false,NULL),
 ('10000000-0000-0000-0000-0000000000ff','Inconnu',NULL,false,NULL),
 ('10000000-0000-0000-0000-0000000000ad','Adulte API',0,true,NULL),
 ('10000000-0000-0000-0000-0000000000ee','Override',12,false,18);
INSERT INTO results SELECT 'effective_min_age par titre (18,16,16,18,18,0)', array_agg(effective_min_age ORDER BY title)=ARRAY[18,16,16,18,18,0]::smallint[] FROM films;

SELECT pg_temp.expect_ok('13 ans : film tous publics', $q$INSERT INTO user_films(user_id,film_id,status) VALUES ('00000000-0000-0000-0000-0000000000c1','10000000-0000-0000-0000-000000000001','seen')$q$);
SELECT pg_temp.expect_err('13 ans : film -16 refusé', $q$INSERT INTO user_films(user_id,film_id,status) VALUES ('00000000-0000-0000-0000-0000000000c1','10000000-0000-0000-0000-000000000016','seen')$q$, 'film_age_restricted');
SELECT pg_temp.expect_ok('16 ans : film -16 accepté', $q$INSERT INTO user_films(user_id,film_id,status) VALUES ('00000000-0000-0000-0000-0000000000b1','10000000-0000-0000-0000-000000000016','seen')$q$);
SELECT pg_temp.expect_err('16 ans : film -18 refusé', $q$INSERT INTO user_films(user_id,film_id,status) VALUES ('00000000-0000-0000-0000-0000000000b1','10000000-0000-0000-0000-000000000018','seen')$q$, 'film_age_restricted');
SELECT pg_temp.expect_ok('16 ans : film inconnu (=16) accepté', $q$INSERT INTO user_films(user_id,film_id,status) VALUES ('00000000-0000-0000-0000-0000000000b1','10000000-0000-0000-0000-0000000000ff','seen')$q$);
SELECT pg_temp.expect_err('16 ans : film marqué adulte refusé', $q$INSERT INTO user_films(user_id,film_id,status) VALUES ('00000000-0000-0000-0000-0000000000b1','10000000-0000-0000-0000-0000000000ad','seen')$q$, 'film_age_restricted');
SELECT pg_temp.expect_err('16 ans : override à 18 refusé', $q$INSERT INTO user_films(user_id,film_id,status) VALUES ('00000000-0000-0000-0000-0000000000b1','10000000-0000-0000-0000-0000000000ee','seen')$q$, 'film_age_restricted');
SELECT pg_temp.expect_ok('adulte : film -18 accepté', $q$INSERT INTO user_films(user_id,film_id,status) VALUES ('00000000-0000-0000-0000-0000000000a1','10000000-0000-0000-0000-000000000018','seen')$q$);
SELECT pg_temp.expect_err('16 ans : avis sur film -18 refusé', $q$INSERT INTO reviews(user_id,film_id,rating) VALUES ('00000000-0000-0000-0000-0000000000b1','10000000-0000-0000-0000-000000000018',4)$q$, 'film_age_restricted');
SELECT pg_temp.expect_err('16 ans : vote sur film -18 refusé', $q$INSERT INTO film_votes(user_id,film_id,vote) VALUES ('00000000-0000-0000-0000-0000000000b1','10000000-0000-0000-0000-000000000018','ok')$q$, 'film_age_restricted');
SELECT pg_temp.expect_err('16 ans : alerte film -18 refusée', $q$INSERT INTO film_alerts(user_id,film_id) VALUES ('00000000-0000-0000-0000-0000000000b1','10000000-0000-0000-0000-000000000018')$q$, 'film_age_restricted');
INSERT INTO results SELECT 'films_for_user(16 ans) = 3 films', count(*)=3 FROM films_for_user('00000000-0000-0000-0000-0000000000b1');
INSERT INTO results SELECT 'films_for_user(adulte) = 6 films', count(*)=6 FROM films_for_user('00000000-0000-0000-0000-0000000000a1');
INSERT INTO results SELECT 'films_for_user(13 ans) = 1 film', count(*)=1 FROM films_for_user('00000000-0000-0000-0000-0000000000c1');

SELECT pg_temp.expect_err('date de naissance verrouillée', $q$UPDATE users SET birth_date='1980-01-01' WHERE pseudo='ado16'$q$, 'birth_date_locked');

SELECT pg_temp.expect_ok('adulte : crée une séance', $q$INSERT INTO screenings(id,host_id,film_id,starts_at) VALUES ('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000a1','10000000-0000-0000-0000-000000000001',now()+interval '1 day')$q$);
SELECT pg_temp.expect_err('mineur : ne crée pas de séance', $q$INSERT INTO screenings(host_id,film_id,starts_at) VALUES ('00000000-0000-0000-0000-0000000000b1','10000000-0000-0000-0000-000000000001',now()+interval '1 day')$q$, 'adults_only');
SELECT pg_temp.expect_err('mineur : ne rejoint pas une séance', $q$INSERT INTO screening_members(screening_id,user_id) VALUES ('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000b1')$q$, 'adults_only');
SELECT pg_temp.expect_ok('adulte : rejoint la séance', $q$INSERT INTO screening_members(screening_id,user_id) VALUES ('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000a1')$q$);
SELECT pg_temp.expect_err('mineur : pas de message de chat', $q$INSERT INTO chat_messages(screening_id,user_id,body) VALUES ('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000b1','salut')$q$, 'adults_only');
SELECT pg_temp.expect_ok('adulte : message de chat', $q$INSERT INTO chat_messages(screening_id,user_id,body) VALUES ('20000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000a1','salut')$q$);
SELECT pg_temp.expect_ok('message système (sans auteur)', $q$INSERT INTO chat_messages(screening_id,user_id,body,kind) VALUES ('20000000-0000-0000-0000-000000000001',NULL,'Clara a rejoint','system')$q$);
SELECT pg_temp.expect_err('séance privée sans code refusée', $q$INSERT INTO screenings(host_id,film_id,starts_at,visibility) VALUES ('00000000-0000-0000-0000-0000000000a1','10000000-0000-0000-0000-000000000001',now(),'private')$q$, 'new row for relation "screenings" violates check constraint "screenings_check"');

INSERT INTO groups(id,name,owner_id,audience) VALUES ('30000000-0000-0000-0000-000000000001','Ados','00000000-0000-0000-0000-0000000000b1','minor');
SELECT pg_temp.expect_ok('groupe mineur : membre mineur', $q$INSERT INTO group_members(group_id,user_id,role) VALUES ('30000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000b1','owner')$q$);
SELECT pg_temp.expect_err('groupe mineur : adulte refusé', $q$INSERT INTO group_members(group_id,user_id) VALUES ('30000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-0000000000a1')$q$, 'group_audience_mismatch');

SELECT CASE WHEN ok THEN 'PASS' ELSE 'FAIL' END AS r, name FROM results ORDER BY ok, name;
SELECT count(*) FILTER (WHERE ok) AS pass, count(*) FILTER (WHERE NOT ok) AS fail FROM results;
