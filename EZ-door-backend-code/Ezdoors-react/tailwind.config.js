/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        brand: {
          primary: "#dc2626", // Tailwind red-600
          primaryDark: "#b91c1c", // Tailwind red-700
          accent: "#f97316", // Tailwind orange-500
        },
      },
      boxShadow: {
        card: "0 10px 25px rgba(15, 23, 42, 0.08)",
      },
      borderRadius: {
        card: "1rem",
      },
    },
  },
  plugins: [],
};

