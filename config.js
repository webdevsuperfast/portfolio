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
      featured: [
        './_assets/images/featured/*.{jpg,png}',
        '!./_assets/images/featured/school-for-selling.jpg'
      ],
      thumbnail: [
        './_assets/images/thumbs/*'
      ],
      dest: './assets/images'
    }
  }
}