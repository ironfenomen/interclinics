#!/usr/bin/env sh
# build-deploy.sh — сборка + подготовка standalone к запуску
#
# Проблема: `output: 'standalone'` НЕ копирует автоматически:
#   .next/static/     → .next/standalone/.next/static/
#   public/           → .next/standalone/public/
# Без этих файлов сервер отдаёт 404 на /_next/static/* и /public/* →
#   - CSS не грузится (всё в .next/static/css/)
#   - JS чанки 404 (React не гидрирует, useLayoutEffect не запускается)
#   - .reveal { opacity: 0 } остаётся — весь контент невидим (шапка без .reveal видна)
#   - /pyatigorsk — голый HTML без стилей
#   - /stavropol — шапка видна, герой и секции скрыты (opacity:0, .visible не добавляется)
#
# Использование:
#   sh scripts/build-deploy.sh           # сборка + копирование
#   sh scripts/build-deploy.sh --no-build # только копирование (пересборка уже есть)
#
set -eu
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DO_BUILD=1
for arg in "$@"; do
  case "$arg" in
    --no-build) DO_BUILD=0 ;;
  esac
done

if [ "$DO_BUILD" = "1" ]; then
  echo "▶ npm run build"
  npm run build
fi

echo "▶ Копируем статику в standalone..."

# CSS, JS чанки, шрифты, медиа
if [ -d ".next/static" ]; then
  rm -rf .next/standalone/.next/static
  cp -r .next/static .next/standalone/.next/static
  echo "  ✓ .next/static → .next/standalone/.next/static"
else
  echo "  ✗ .next/static не найден — запустите сначала npm run build" >&2
  exit 1
fi

# Публичные файлы (favicon, картинки, аудио и т.д.)
if [ -d "public" ]; then
  rm -rf .next/standalone/public
  cp -r public .next/standalone/public
  echo "  ✓ public/ → .next/standalone/public/"
fi

echo ""
echo "✓ Готово. Запуск сервера:"
echo "  node .next/standalone/server.js"
echo ""
echo "  Переменные окружения не забудь:"
echo "  PORT=3000 HOSTNAME=0.0.0.0 node .next/standalone/server.js"
