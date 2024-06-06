/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        putty: {
          50: "#fcf9f0",
          100: "#f8f0dc",
          200: "#f0dfb8",
          300: "#e8cc93",
          400: "#dba95c",
          500: "#d3923c",
          600: "#c57c31",
          700: "#a4612a",
          800: "#834d29",
          900: "#6a4124",
          950: "#392011",
        },
        martinique: {
          50: "#f4f6fa",
          100: "#e5e8f4",
          200: "#d1d7ec",
          300: "#b2bdde",
          400: "#8d9bcd",
          500: "#727dbf",
          600: "#5f66b1",
          700: "#5456a1",
          800: "#494984",
          900: "#3e3f6a",
          950: "#343454",
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        ibm: ["IBM Plex Serif", "sans-serif"],
      },
    },
  },
  plugins: [],
};
