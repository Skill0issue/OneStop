/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "radial-gradient-green":
          "radial-gradient(circle, rgba(183, 46, 178, 0.84), rgba(223, 106, 186, 0.86))",
        "custom-radial-gradient":
          "radial-gradient(circle, #E46BBB 0%, #E280C1 8%, #DF9FC9 10%, #D9D9D9 44%, #EB78BD 44%, #B72EB2 100%)",
      },

      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
        "2xl": "1536px",
      },
      colors: {
        "white": "#FFFFFF",
        "white-primary": "#E6E6E6",
        "white-secondary": "",
        "dark": "#17181E",
        "dark-primary": "#30303D",
        "dark-secondary": "",
      },
      fontFamily: {
        lexDec: "Lexend Deca",
        poppins: "Poppins",
        playwrite: "Playwrite PL",
      },
      fontWeight: {
        Thin: 100,
        extraLight: 200,
        light: 300,
        regular: 400,
        medium: 500,
        semiBold: 600,
        bold: 700,
        extraBold: 800,
      },
      container: {
        padding: {
          DEFAULT: 0,
          sm: "1rem",
          lg: "2rem",
          xl: "4rem",
          "2xl": "5rem",
        },
        margin: {
          DEFAULT: 0,
        },
        position: {
          DEFAULT: "static",
        },
      },
      boxShadow: {
        black:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        white:
          "0 10px 15px -3px rgb(255 255 255 / 0.1), 0 4px 6px -4px rgb(255 255 255 / 0.1)",
      },
    },
  },
  plugins: [],
};
