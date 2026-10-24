/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        bg: '#020617',
        surface: '#0f172a',
        'surface-2': '#111827',
        muted: '#94a3b8',
        ink: '#e2e8f0'
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Noto Sans Kannada"', 'sans-serif'],
        sans: ['Outfit', '"Noto Sans Kannada"', 'sans-serif']
      }
    }
  },
  plugins: []
};
