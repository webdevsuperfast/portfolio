module.exports = {
  content: [
    './index.html',
    './**/index.html',
    './_layouts/**/*.html',
    './_includes/**/*.html',
    './_site/**/*.{html,js}',
  ],
  theme: {
    extend: {
      fontFamily: {
        barlow: ['Barlow', 'sans-serif'],
        sacramento: ['Sacramento', 'cursive']
      },
      fontSize: {
        '14xl': ['14rem', {
          lineHeight: '1'
        }]
      }
    },
  },
  plugins: [],
}
