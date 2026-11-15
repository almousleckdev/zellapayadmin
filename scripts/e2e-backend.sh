#!/usr/bin/env bash
# Starts the backend for end-to-end tests on a throwaway database, and removes
# the database when stopped. Needs `make up` running in ../zellapay.
set -euo pipefail

backend="../zellapay"
db="zp_e2e_admin"
port="${E2E_API_PORT:-8082}"
psql() { docker exec -i zellapay-postgres-1 psql -U zellapay -q "$@"; }

[ -f "$backend/.env.local" ] || { echo "run 'make env' in $backend first" >&2; exit 1; }
set -a
# shellcheck disable=SC1091
source "$backend/.env.local"
set +a

psql -d zellapay -c "DROP DATABASE IF EXISTS $db WITH (FORCE)" -c "CREATE DATABASE $db" >/dev/null 2>&1
export ZP_DATABASE_URL="postgres://zellapay:zellapay-local-only@127.0.0.1:5433/$db?sslmode=disable"
export ZP_MIGRATE_DATABASE_URL="$ZP_DATABASE_URL"
export ZP_HTTP_ADDR=":$port"
# Passkeys are bound to this address, so it must be where the console runs.
export ZP_ADMIN_URL="http://localhost:${E2E_APP_PORT:-3102}"
export ZP_WEBAUTHN_RP_ID="localhost"

cleanup() {
  [ -n "${api_pid:-}" ] && kill "$api_pid" 2>/dev/null || true
  psql -d zellapay -c "DROP DATABASE IF EXISTS $db WITH (FORCE)" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

(cd "$backend" && go run ./cmd/migrate up >/dev/null)
(cd "$backend" && go build -o "/tmp/zp-e2e-admin-api" ./cmd/api)
/tmp/zp-e2e-admin-api &
api_pid=$!
wait "$api_pid"
