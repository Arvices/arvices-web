// tailwind.config.js
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bluenova: {
          100: "#e0f2ff",
          200: "#b9ddff",
          300: "#91c8ff",
          400: "#69b3ff",
          500: "#419eff", // primary
          600: "#1a89ff",
          700: "#006fd6",
          800: "#0055a3",
          900: "#003b70",
        },
      },
    },
  },
  plugins: [],
};
