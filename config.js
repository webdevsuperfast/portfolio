module.exports = {
  config: {
    tailwind: './tailwind.config.js',
    postcss: './postcss.config.js',
  },
  paths: {
    styles: {
      src: './_assets/scss',
      dest: './assets/css'
    },
    scripts: {
      src: './_assets/js',
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
    }
  }
}