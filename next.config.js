/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    // better-sqlite3 — нативный модуль (Next 14: ключ experimental)
    serverComponentsExternalPackages: ['better-sqlite3'],
  },

  // Статическая генерация всех страниц при билде
  output: 'standalone',

  // Canonical URLs со слэшем: /stavropol/ вместо /stavropol (убирает 308 редирект = -900ms LCP)
  trailingSlash: true,

  /**
   * Dev: poll на macOS (EMFILE). Не трогаем optimization.moduleIds/chunkIds — в Next 14 App Router
   * кастомные named ids ломают компиляцию страниц (все маршруты падают в 404 / Internal error).
   * Скрипт `npm run dev` перед стартом удаляет .next (scripts/dev.sh).
   *
   * Не задаём resolve.alias на react/react-dom: в Next 14 это ломает сборку (напр. «cache is not a function»
   * в server chunks). Дедупликация — через package.json overrides + один react в npm ls.
   */
  webpack: (config, { dev }) => {
    if (dev && process.platform === 'darwin') {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 2000,
        aggregateTimeout: 800,
      }
    }
    return config
  },
  
  // Оптимизация изображений
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 768, 1024, 1280],
  },

  /**
   * Cache-Control для public/* (standalone + nginx могут дублировать — на проде сверить заголовки).
   * PSI: длинный TTL для аудио/картинок; hashed /_next/static/* уже отдаётся Next с immutable.
   * Дополнительно на nginx: `location /_next/static/ { add_header Cache-Control "public, max-age=31536000, immutable"; }`
   */
  async headers() {
    const year = 'public, max-age=31536000, immutable'
    const month = 'public, max-age=2592000, stale-while-revalidate=86400'
    return [
      { source: '/audio/:path*', headers: [{ key: 'Cache-Control', value: year }] },
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: month }] },
      { source: '/og-default.jpg', headers: [{ key: 'Cache-Control', value: month }] },
      { source: '/favicon.ico', headers: [{ key: 'Cache-Control', value: month }] },
      { source: '/favicon.svg', headers: [{ key: 'Cache-Control', value: month }] },
      { source: '/apple-touch-icon.png', headers: [{ key: 'Cache-Control', value: month }] },
      { source: '/android-chrome-512x512.png', headers: [{ key: 'Cache-Control', value: month }] },
    ]
  },

  // Редиректы
  async redirects() {
    return [
      // Услуги из data/services без отдельного app/[city]/…/page.tsx → существующие посадочные
      {
        source: '/:city/lechenie-narkomanii',
        destination: '/:city/stacionar',
        permanent: false,
      },
      {
        source: '/:city/lechenie-alkogolizma',
        destination: '/:city/vyvod-iz-zapoya',
        permanent: false,
      },
      // Старые WordPress URL → актуальные страницы (раньше вели на несуществующий /…/lechenie-narkomanii)
      {
        source: '/%D0%BB%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B0%D0%BB%D0%BA%D0%BE%D0%B3%D0%BE%D0%BB%D0%B8%D0%B7%D0%BC%D0%B0',
        destination: '/stavropol/vyvod-iz-zapoya',
        permanent: true,
      },
      {
        source: '/%D0%BB%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B8%D0%B8',
        destination: '/stavropol/stacionar',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
