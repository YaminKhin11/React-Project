/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      mobile_small: "320px",
      mobile_medium: "375px",
      mobile_large: "425px",
      tablet_sm: "640px",
      // => @media (min-width: 640px) { ... }

      tablet: "768px",
      // => @media (min-width: 768px) { ... }

      laptop: "1024px",
      // => @media (min-width: 1024px) { ... }

      laptop_medium: "1280px",
      // => @media (min-width: 1280px) { ... }

      laptop_large: "1440px",
      // => @media (min-width: 1440px) { ... }

      desktop_large: "1536px",
      // => @media (min-width: 1536px) { ... }
      desktop_4K: "2560px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        monaSans: ["Mona-Sans", "sans-serif"],
        monaSansItalic: ["Mona-Sans-Italic", "sans-serif"],
        monaSansWide: ["Mona-Sans-Wide", "sans-serif"],
        monaSansMWide: ["Mona-Sans-MWide", "sans-serif"],
        monaSansLWide: ["Mona-Sans-LWide", "sans-serif"],
        epilogue: ["Epilogue", "sans-serif"],
        epilogueLight: ["Epilogue-Light", "sans-serif"],

        space: ["SpaceGrotesk", "sans-serif"],
      },
      colors: {
        theme: "var(--color-theme)",
        highlight: "var(--color-highlight)",
        secondary: "var(--color-secondary)",
        content: "var(--color-content)",
      },
      fontSize: {
        default: "16px",
        header: "32px",
        caption: "14px",
        subHeader: "24px",
        mobileHeader: "21px",
        mobileSubHeader: "18px",
      },
      container: {
        center: true,
        padding: "0.5rem",
      },
      // maxWidth: {
      //   'main': '1080px',
      // },
    },
  },
  plugins: [],
};
