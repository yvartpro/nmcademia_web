/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
          0: '#FAFAF9',
          1: '#FFFFFF',
          2: '#F4F4F5',
          '0-dark': '#09090B',
          '1-dark': '#18181B',
          '2-dark': '#27272A',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
          muted: '#FEF3C7',
        },
        brand: {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          dark: '#1D4ED8',
        },
        gold: {
          light: '#FDE68A',
          DEFAULT: '#FBBF24',
          dark: '#B45309',
        },
        primary: '#0b0f19',
        streak: '#F97316',
        success: '#10B981',
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
