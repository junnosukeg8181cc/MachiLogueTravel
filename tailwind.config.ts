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
        primary: "#0052CC",
        "primary-dark": "#0042a3",
        "background-light": "#F3F4F6",
        "background-dark": "#0f172a",
        surface: "#FFFFFF",
        "surface-dark": "#1e293b",
        gold: "#D9A54C",
      },
      fontFamily: {
        display: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-lora)", "serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
        'xl': "1rem",
        '2xl': "1.5rem",
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 10px rgba(0,0,0,0.03)',
      }
    },
  },
  plugins: [],
};
export default config;