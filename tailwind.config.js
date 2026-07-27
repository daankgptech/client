// /** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['"Space Grotesk"', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      colors: {
        primary: "#FF3130",
        secondary: "#00c3c7",
        dark: "#000000",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          md: "3rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
    },
  },
  plugins: [],
};
