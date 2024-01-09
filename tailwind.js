module.exports = {
  content: [
    "./public/index.html",
    "./resources/js/**/*.jsx",
  ],
  theme: {
    extend: {
      screens: {
        pwa: { raw: "(display-mode: standalone)" },
      },
    },
  }
}
