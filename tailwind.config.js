/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "xl-plus": "1440px",
      },
      colors: {
        "main-primary": "#FEB7DC",
        "main-dark": "#FD86C8",
        "main-darker": "#D850AB",
        "main-accent": "#FF6AB9",
        "main-ligther": "#edd5e2",
        "custom-red": "#dc3545",
      },
      fontSize: {
        mianheading: "45px",
        secondheading: "20px",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      animation: {
        fade: "fadeOut 5s ease-in-out",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
});
