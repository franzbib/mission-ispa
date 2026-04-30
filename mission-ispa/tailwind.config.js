/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ispa: {
          dark: '#1e293b',
          light: '#f8fafc',
          accent: '#d97706',
          document: '#fdfbf7',
          ink: '#334155',
          success: '#10b981',
          error: '#ef4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        handwriting: ['"Kalam"', 'cursive']
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'paper': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
      }
    },
  },
  plugins: [],
}
