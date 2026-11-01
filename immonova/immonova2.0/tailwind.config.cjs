/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: { fadein: { from: { opacity: '0' }, to: { opacity: '1' } } },
      fontFamily: {
        sans: ['var(--font-nunito)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: { 50: '#FFFDF8', 100: '#FFF8EE', 200: '#FDEFD8' },
        sun: { 100: '#FFF1CC', 200: '#FFE3A3', 400: '#F5B83D', 700: '#8A5A00' },
        forest: { 700: '#065F46', 800: '#1F3D2F' },
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
    },
  },
  plugins: [],
}

