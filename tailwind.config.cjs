/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#bef264",
          400: "#a3e635",
          500: "#84cc16",
          600: "#65a30d",
          700: "#4d7c0f",
          800: "#3f6212",
          900: "#365314",
        },
      },
    },
  },
  safelist: [
    'bg-lime-200',
    'bg-lime-300',
    'bg-lime-400',
    'text-lime-900',
    'hover:bg-lime-300',
    'hover:bg-lime-400',
  ],
  plugins: [],
};
