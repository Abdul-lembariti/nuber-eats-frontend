const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.tsx'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lime: colors.lime,
        primary: '#5FB709',
      },
    },
  },
  plugins: [],
}
