/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#104e45',
        secondary: '#818361',
        // orange: '#ef9247',
        dark: '#000000',
      },
      screens: {
        'iphonese': '360px', // Breakpoint pour l'iPhone SE
        // 'md': '768px',       // Écran moyen
        // 'lg': '1024px',      // Écran large
      },
    },
  },
  plugins: [],
}

