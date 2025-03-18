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
        playfair: ['"Playfair Display"', 'serif'],
        openSans: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
