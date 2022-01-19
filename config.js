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
        './_assets/images/featured/*.{jpg,png,jpeg}'
      ],
      thumbnail: [
        './_assets/images/thumbs/*'
      ],
      other: [
        './_assets/images/background.jpg',
        './_assets/images/upwork.png',
        './_assets/images/wordpress.png'
      ],
      dest: './assets/images'
    }
  }
}