// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontSize: {
//         'course-details-heading-small': ['26px', '36px'],
//         'course-details-heading-large': ['36px', '44px'],
//         'home-heading-small': ['28px', '34px'],
//         'home-heading-large': ['48px', '56px'],
//         'default': ['15px', '21px'],
//       },
//       fontFamily: {
//         outfit: ['Outfit', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'course-details-heading-small': ['26px', '36px'],
        'course-details-heading-large': ['36px', '44px'],
        'home-heading-small': ['28px', '34px'],
        'home-heading-large': ['48px', '56px'],
        'default': ['15px', '21px'],
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        display: ["Fraunces", "Playfair Display", "Georgia", "serif"],
        body: ["Source Serif 4", "Georgia", "serif"],
        meta: ["Inter", "sans-serif"],
      },
      colors: {
        paper: "#F8F5EE",
        "paper-alt": "#FFFDF8",
        ink: "#211F1B",
        navy: "#1D2B3A",
        oxblood: "#7A2E2E",
        brass: "#A9823D",
        muted: "#6B6355",
        faint: "#A39A88",
      },
    },
  },
  plugins: [],
};