/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        crimson: {
          50: "#fff0f2",
          100: "#ffe3e4",
          200: "#ffcbd1",
          300: "#ffa0aa",
          400: "#ff6b7e",
          500: "#fb3855",
          600: "#dc143c",
          700: "#c50b34",
          800: "#a50c33",
          900: "#8d0e33",
          950: "#4f0217",
        },
      },
    },
  },
  plugins: [],
};
