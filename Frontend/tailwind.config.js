/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'limegreen': '#94C973',
        'darkgreen': '#5CAC0E',
        'menu': 'FDFDFD'
      },
      fontFamily: {
        poppins: ["Poppins"],
    }
    },
  },
  plugins: [],
};
