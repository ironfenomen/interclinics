import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        deep: {
          DEFAULT: '#071423',
          2: '#0B1D35',
          3: '#143252',
        },
        surface: {
          bg: '#F5F8FC',
          'bg-2': '#EEF4FA',
        },
        ink: {
          DEFAULT: '#162334',
          muted: '#5E7288',
          'muted-2': '#8EA0B3',
        },
        line: '#DCE6F1',
        emerald: {
          DEFAULT: '#10B981',
          2: '#0FA06F',
        },
        gold: {
          DEFAULT: '#D7B469',
        },
        danger: '#E95E5E',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(9,20,35,.05)',
        landing: '0 8px 24px rgba(10,25,45,.08)',
        landingMd: '0 18px 48px rgba(10,25,45,.12)',
        landingLg: '0 28px 80px rgba(7,20,35,.18)',
        cta: '0 16px 34px rgba(16,185,129,.25)',
        ctaHover: '0 22px 46px rgba(16,185,129,.3)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        pulseDot: {
          '0%,100%': {
            opacity: '1',
            boxShadow: '0 0 0 0 rgba(66,224,166,.5)',
          },
          '70%': {
            opacity: '.75',
            boxShadow: '0 0 0 10px rgba(66,224,166,0)',
          },
        },
      },
      animation: {
        'pulse-dot': 'pulseDot 1.5s infinite',
      },
      maxWidth: {
        container: '1240px',
      },
    },
  },
  plugins: [],
}
export default config
