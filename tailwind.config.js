/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: '#0b0f19', // Deep dark backdrop
        accent: '#fbbf24',  // Vibrant Amber/Gold
        gold: {
          light: '#fde68a',
          DEFAULT: '#fbbf24',
          dark: '#b45309',
        },
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155'
        }
      }
    },
  },
  plugins: [],
}
