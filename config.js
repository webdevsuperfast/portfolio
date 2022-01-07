module.exports = {
  config: {
    tailwind: './tailwind.config.js',
    postcss: './postcss.config.js',
  },
  paths: {
    styles: {
      src: './assets/scss',
      dest: './assets/css'
    },
    scripts: {
      src: [
        'node_modules/mixitup/dist/mixitup.js',
        'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
        'node_modules/vanilla-lazyload/dist/lazyload.js'
      ],
      minified: [
        
      ],
      dest: './assets/js'
    },
    images: {
      feature: [
        './develop/images/*.{jpg,png}',
        '!./develop/images/school-for-selling.jpg',
        '!./develop/images/*.svg',
        '!./develop/images/thumbs/*.{jpg,png}'
      ],
      thumbnail: [
        './develop/images/thumbs/*'
      ]
    },
    sources: {
      src: [
        
      ],
      dest: './assets/scss/sources/'
    }
  }
}