
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a202c',
        'card-bg': '#2d3748',
      },
    },
  },
  plugins: [],
  darkMode: 'class',  // Enable dark mode
}