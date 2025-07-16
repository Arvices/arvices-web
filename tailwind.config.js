// tailwind.config.js
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        royalblue: {
          main: "#0026BD",
          tint1: "#143AD0",
          tint2: "#3657D9",
          tint3: "#5977EF",
          tint4: "#7A92F2",
          tint5: "#A9BAFF",
          tint6: "#D9E0FF",
          shade1: "#1536B7",
          shade2: "#213BA3",
          shade3: "#283568",
          shade4: "#2A3E8B",
          shade5: "#2D3659",
          shade6: "#2E3449",
        },
      },
      backgroundImage: {
        "gradient-arvicepink": "linear-gradient(to right, #FF4489, #FFA8C8)",
        "gradient-royalblue": "linear-gradient(to right, #0026BD, #5977EF)",
      },
    },
  },
  plugins: [],
  safelist: ["text-royalblue-main"],
};
