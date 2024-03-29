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
        'ibm-plex-sans': ['IBM Plex Sans', 'sans-serif'],
      },
      fontSize: {
        '14xl': ['14rem', {
          lineHeight: '1'
        }],
        '16xl': ['16rem', {
          lineHeight: '1'
        }]
      },
      backgroundImage: {
        body: 'url(../images/background.webp)',
      }
    },
  },
  plugins: [],
}
