import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        foreground: "#EDEDED",
        sand: {
          50: "#FAF8F5",
          100: "#F4F0E8",
          200: "#EAE3D6",
          300: "#DFD5C2",
          400: "#D4C7AE",
          500: "#C7B798",
          DEFAULT: "#E7E0D3",
        },
        noir: {
          950: "#080808",
          900: "#090909",
          800: "#111111",
          700: "#1A1A1A",
          600: "#242424",
          500: "#333333",
        },
        bronze: {
          DEFAULT: "#C5A059",
          light: "#DFC082",
          dark: "#997A3B",
        }
      },
      fontFamily: {
        display: ["'Bebas Neue'", "'Oswald'", "sans-serif"],
        serif: ["'Playfair Display'", "'Cinzel'", "Georgia", "serif"],
        sans: ["'Inter'", "'Plus Jakarta Sans'", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.03em",
        widest: "0.2em",
        monumental: "0.3em",
      }
    },
  },
  plugins: [],
};
export default config;
