/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // Updated for Tailwind v4
    autoprefixer: {},
  },
};

export default config;