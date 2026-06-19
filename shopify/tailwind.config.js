/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    './layout/**/*.liquid',
    './templates/**/*.json',
    './templates/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './assets/**/*.js',
    './config/**/*.json'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};
