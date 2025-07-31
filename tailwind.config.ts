import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tarkia: {
          gold: '#c8a46e',
          dark: '#1a1a1a',
          blue: '#2a5298',
          light: '#f0f2f5',
        },
        primary: {
          50: '#faf7f2',
          100: '#f3edde',
          200: '#e6d9bc',
          300: '#d5c193',
          400: '#c8a46e',
          500: '#b8934f',
          600: '#a17d43',
          700: '#876539',
          800: '#6f5433',
          900: '#5c462b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['var(--font-playfair)', 'Playfair Display', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'tarkia': '0 4px 20px rgba(200, 164, 110, 0.15)',
        'tarkia-lg': '0 10px 40px rgba(200, 164, 110, 0.2)',
      },
    },
  },
  plugins: [],
}
export default config 