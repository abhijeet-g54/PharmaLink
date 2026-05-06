/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // THIS IS CRITICAL: It tells Tailwind to scan the 'app' folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}