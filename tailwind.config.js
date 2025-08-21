// tailwind.config.js
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
    safelist: [
    {
      pattern: /(bg|text|border)-(blue|green|pink|amber|red|purple)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
  plugins: [],
};
