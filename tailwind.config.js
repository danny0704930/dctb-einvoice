/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        panel: "#151515",
        line: "#2a2a2a",
        accent: "#4ade80",
        accentDark: "#3fc973",
      },
    },
  },
  plugins: [],
};
