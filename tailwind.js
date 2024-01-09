module.exports = {
  content: [
    "./public/index.html",
    "./resources/js/**/*.jsx",
  ],
  theme: {
    extend: {
      animation: {
        background: "background 30s ease-in-out infinite",
      },
      keyframes: {
        background: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      screens: {
        pwa: { raw: "(display-mode: standalone)" },
      },
    },
  },
}
