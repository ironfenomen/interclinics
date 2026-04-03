#!/usr/bin/env sh
# Только освободить PORT (по умолчанию 3000) — без запуска next.
# Полезно перед ручным next dev или если dev «завис» в фоне.
set -eu
PORT="${PORT:-3000}"
if ! command -v lsof >/dev/null 2>&1; then
  echo "dev-stop: lsof не найден" >&2
  exit 1
fi
pids=$(lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null || true)
if [ -z "${pids:-}" ]; then
  echo "dev-stop: на порту $PORT никто не слушает"
  exit 0
fi
for pid in $pids; do
  kill "$pid" 2>/dev/null || true
done
sleep 0.45
pids=$(lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null || true)
if [ -n "${pids:-}" ]; then
  for pid in $pids; do
    kill -9 "$pid" 2>/dev/null || true
  done
fi
echo "dev-stop: порт $PORT освобождён"
