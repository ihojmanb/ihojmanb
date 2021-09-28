module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
    // purgeLayersByDefault: true,
  },
  // mode: "jit",
  purge: [
    "./.eleventy.js",
    "./public/**/*.html",
    "./src/_includes/**/*.njk",
    "./src/pages/**/*.{njk, md}",
    "./src/index.njk",
    "./src/scripts/**/*.js",
    "./src/styles/**/*.css",
    "./src/tests/**/*.js",
    "./src/index.njk",
    "./src/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["IBM Plex Sans"],
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-underline-utils'),
    function ({ addUtilities }) {
      const extendUnderline = {
        ".underline-magenta": {
          textDecoration: "underline",
          "text-decoration-color": "#FF00FF",
        },
      };
      addUtilities(extendUnderline);
    },
  ],
};
