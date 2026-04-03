#!/usr/bin/env sh
# Стабильный next dev:
# 1) Освобождаем PORT (по умолчанию 3000), чтобы не плодить процессы на 3001/3002/…
# 2) .next удаляем ТОЛЬКО при NEXT_DEV_CLEAN=1 (восстановление после битого HMR), не на каждый старт
#
# Использование:
#   npm run dev
#   PORT=3005 npm run dev
#   NEXT_DEV_CLEAN=1 npm run dev        # полная пересборка кэша
#   NEXT_DEV_TURBO=1 npm run dev        # next dev --turbo
#
set -eu
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ulimit -n 65536 2>/dev/null || ulimit -n 10240 2>/dev/null || true

PORT="${PORT:-3000}"
NEXT_BIN="$ROOT/node_modules/.bin/next"
if [ ! -e "$NEXT_BIN" ]; then
  echo "dev: не найден $NEXT_BIN — выполните npm install" >&2
  exit 1
fi

# Завершить процесс(ы), слушающие TCP-порт (LISTEN). Только этот порт — без killall node.
free_port() {
  p="$1"
  if ! command -v lsof >/dev/null 2>&1; then
    echo "dev: lsof не найден — пропускаю освобождение порта $p (поставьте lsof или укажите свободный PORT)" >&2
    return 0
  fi
  # shellcheck disable=SC2009
  pids=$(lsof -nP -iTCP:"$p" -sTCP:LISTEN -t 2>/dev/null || true)
  if [ -z "${pids:-}" ]; then
    return 0
  fi
  for pid in $pids; do
    kill "$pid" 2>/dev/null || true
  done
  sleep 0.45
  pids=$(lsof -nP -iTCP:"$p" -sTCP:LISTEN -t 2>/dev/null || true)
  if [ -n "${pids:-}" ]; then
    for pid in $pids; do
      kill -9 "$pid" 2>/dev/null || true
    done
  fi
}

free_port "$PORT"

if [ "${NEXT_DEV_CLEAN:-}" = "1" ]; then
  echo "dev: NEXT_DEV_CLEAN=1 — удаляю .next и node_modules/.cache"
  rm -rf .next
  rm -rf node_modules/.cache
fi

TURBO_FLAG=""
if [ "${NEXT_DEV_TURBO:-}" = "1" ]; then
  TURBO_FLAG="--turbo"
fi

exec "$NEXT_BIN" dev -p "$PORT" $TURBO_FLAG "$@"
