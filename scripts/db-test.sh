#!/usr/bin/env bash
# Apply all migrations to a throwaway Supabase Postgres container and run the pgTAP tests in
# supabase/tests. Needs only Docker + the supabase/postgres image (no full `supabase start`),
# so it also works in the Claude Code cloud sandbox. With a running local stack prefer `pnpm db:test`.
set -euo pipefail

IMAGE="${SUPABASE_PG_IMAGE:-supabase/postgres:17.11.0.002}"
NAME="clapp_db_test_$$"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if ! docker ps >/dev/null 2>&1; then
  if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ] && command -v dockerd >/dev/null; then
    (nohup dockerd >/tmp/dockerd.log 2>&1 &)
    for _ in $(seq 1 30); do docker ps >/dev/null 2>&1 && break; sleep 1; done
  fi
  docker ps >/dev/null 2>&1 || { echo "Docker is not running." >&2; exit 1; }
fi

cleanup() { docker rm -f "$NAME" >/dev/null 2>&1 || true; }
trap cleanup EXIT

docker run -d --name "$NAME" --network none -e POSTGRES_PASSWORD=postgres "$IMAGE" >/dev/null
psql_as() { docker exec -i "$NAME" psql -v ON_ERROR_STOP=1 -U "$1" -h localhost -d postgres -q "${@:2}"; }

echo "Waiting for database…"
for _ in $(seq 1 90); do
  if docker exec "$NAME" psql -U postgres -h localhost -d postgres -tAc "select to_regclass('auth.users')" 2>/dev/null | grep -q users; then
    break
  fi
  sleep 2
done

# Migrations run as `postgres`, like on Supabase (so default grants for anon/authenticated apply).
for f in "$ROOT"/supabase/migrations/*.sql; do
  echo "migrate: $(basename "$f")"
  psql_as postgres < "$f"
done

psql_as supabase_admin -c "create extension if not exists pgtap with schema extensions"

status=0
for f in "$ROOT"/supabase/tests/*.sql; do
  echo "test: $(basename "$f")"
  output="$( (echo 'set search_path = public, extensions;'; cat "$f") | docker exec -i "$NAME" psql -U postgres -h localhost -d postgres -At 2>&1)"
  echo "$output" | grep -E '^(ok|not ok|#)|ERROR' || true
  if echo "$output" | grep -qE '^not ok|ERROR|Looks like you failed'; then status=1; fi
done

exit $status
