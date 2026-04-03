/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Статическая генерация всех страниц при билде
  output: 'standalone',

  /**
   * Dev: poll на macOS (EMFILE). Не трогаем optimization.moduleIds/chunkIds — в Next 14 App Router
   * кастомные named ids ломают компиляцию страниц (все маршруты падают в 404 / Internal error).
   * Скрипт `npm run dev` перед стартом удаляет .next (scripts/dev.sh).
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

  // Редиректы
  async redirects() {
    return [
      // Старые WordPress URL → новые
      {
        source: '/%D0%BB%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D0%B0%D0%BB%D0%BA%D0%BE%D0%B3%D0%BE%D0%BB%D0%B8%D0%B7%D0%BC%D0%B0',
        destination: '/stavropol/vyvod-iz-zapoya',
        permanent: true,
      },
      {
        source: '/%D0%BB%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D1%80%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B8%D0%B8',
        destination: '/stavropol/lechenie-narkomanii',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
