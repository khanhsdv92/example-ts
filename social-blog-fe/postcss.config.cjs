// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ✅ thay vì tailwindcss: {}
    autoprefixer: {},
  },
};
