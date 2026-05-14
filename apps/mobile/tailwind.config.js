const { hairlineWidth } = require("nativewind/theme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#5A7A3A",
        "primary-light": "#EAF0E4",
        "primary-dark": "#3A5828",
        surface: "#FFFFFF",
        background: "#F6F8F4",
        border: "#D8E4D0",
        "text-primary": "#1E2A1A",
        "text-secondary": "#7A9868",
        accent: "#E4EEDC",
        badge: "#DEECD4",
      },
      borderWidth: { hairline: hairlineWidth() },
    },
  },
  plugins: [],
};
