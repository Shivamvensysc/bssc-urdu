/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
 theme: {
    extend: {
      colors: {
        ink: "#12233F",
        "ink-soft": "#5B6B84",
        paper: "#F4F5F2",
        card: "#FFFFFF",
        line: "#DBDFE6",
        ochre: "#B9722E",
        "ochre-deep": "#8F5522",
        teal: "#1E6F5C",
        danger: "#B3432B",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
}

