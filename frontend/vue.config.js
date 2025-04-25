// vue.config.js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './', //mi ruta publica
  outputDir: 'dist', //aqui esta el build de vue
  indexPath: 'index.html', //lo que lanzara el aplicativo
})
