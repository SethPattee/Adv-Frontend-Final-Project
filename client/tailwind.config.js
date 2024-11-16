/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Include all your component files
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // You can define custom colors for light and dark modes
        primary: {
          light: '#FFCC00', // Light mode primary color
          dark: '#FFD700', // Dark mode primary color
        },
        background: {
          light: '#FFFFFF',
          dark: '#1A202C',
        },
        text: {
          light: '#000000',
          dark: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};
