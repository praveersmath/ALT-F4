/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1F7A3D",
        accent: "#B45309",
        danger: "#B91C1C",
        info: "#1D4ED8",
        bg: "#F7F8F5",
        surface: "#FFFFFF",
        border: "#E2E5DC",
        heading: "#1A1F16",
        muted: "#5B6354",
      },
    },
  },
  plugins: [],
}

