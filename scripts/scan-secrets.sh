#!/usr/bin/env bash
# Le dépôt est public : à lancer avant de pousser. Affiche seulement les noms de fichiers, jamais les valeurs.
# Usage : bash scripts/scan-secrets.sh
cd "$(git rev-parse --show-toplevel)" || exit 2

PAT='(sk-[A-Za-z0-9_-]{20,}|sk-ant-[A-Za-z0-9_-]{10,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|phc_[A-Za-z0-9]{20,}|postgres(ql)?://[^:@/ ]+:[^@ ]{3,}@[^ ]*\.(neon\.tech|supabase\.co|vercel-storage\.com)|-----BEGIN [A-Z ]*PRIVATE KEY|xox[baprs]-[A-Za-z0-9-]{10,}|(AUTH_SECRET|KINDE_CLIENT_SECRET|CLIENT_SECRET|API_KEY|SECRET_KEY)[=:] *["'"'"']?[A-Za-z0-9_-]{12,})'
status=0

hits=$(git grep -I -l -E "$PAT" -- . ':!*package-lock.json')
if [ -n "$hits" ]; then echo "Motif de secret trouvé dans :"; echo "$hits"; status=1; fi

files=$(git ls-files | grep -iE '(^|/)\.env($|\.)|\.pem$|\.key$|\.p12$|id_rsa|\.db$|\.db-journal$|\.sqlite3?$' | grep -v '\.env\.example$')
if [ -n "$files" ]; then echo "Fichier sensible suivi par git :"; echo "$files"; status=1; fi

[ $status -eq 0 ] && echo "Rien de suspect dans les fichiers suivis."
exit $status
