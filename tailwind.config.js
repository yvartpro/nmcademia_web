/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
  colors: {
        surface: {
          0: '#FFFFFF',
          1: '#FFFFFF',
          2: '#F4F6F5',
          '0-dark': '#FFFFFF',
          '1-dark': '#FFFFFF',
          '2-dark': '#F4F6F5',
        },
        accent: {
          DEFAULT: '#008A20',
          light: '#EAF6EC',
          dark: '#006616',
          muted: 'rgba(0, 138, 32, 0.1)',
        },
        brand: {
          DEFAULT: '#008A20',
          light: '#008A20',
          dark: '#006616',
        },
        gold: {
          light: '#EAF6EC',
          DEFAULT: '#008A20',
          dark: '#006616',
        },
        primary: '#0A0F0D',
        streak: '#F97316',
        success: '#008A20',
      },
      borderRadius: {
        card: '12px',
        modal: '16px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-dark': '0 1px 3px 0 rgb(0 0 0 / 0.3), inset 0 1px 0 0 rgb(255 255 255 / 0.04)',
        glow: '0 0 40px -8px rgb(245 158 11 / 0.35)',
        'glow-brand': '0 0 40px -8px rgb(37 99 235 / 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgb(245 158 11 / 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgb(245 158 11 / 0)' },
        },
      },
    },
  },
  plugins: [],
};
