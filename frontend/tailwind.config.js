/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Dossier où Tailwind doit scanner tes fichiers
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        signature: ["Great Vibes", "cursive"],

      },
    },
  },
  plugins: [],
};
