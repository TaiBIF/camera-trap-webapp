const path = require('path')

module.exports = {
  pages: {
    index: {
      entry: 'src/pages/index/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Index Page',
      // chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    demo: {
      entry: 'src/pages/demo/main.js',
      template: 'public/demo.html',
      filename: 'demo.html',
      title: 'Demo Page',
      // chunks: ['chunk-vendors', 'chunk-common', 'intro']
    },
    login: {
      entry: 'src/pages/login/main.js',
      template: 'public/login.html',
      filename: 'login.html',
      title: 'Login Page',
      // chunks: ['chunk-vendors', 'chunk-common', 'intro']
    },
    dummy: {
      entry: 'src/pages/dummy/main.js',
      template: 'public/dummy.html',
      filename: 'dummy.html',
      title: 'dummy Page',
      // chunks: ['chunk-vendors', 'chunk-common', 'intro']
    }
    // when using the entry-only string format,
    // template is inferred to be `public/subpage.html`
    // and falls back to `public/index.html` if not found.
    // Output filename is inferred to be `subpage.html`.
    // subpage: 'src/subpage/main.js'
  },
  css: {
    loaderOptions: {
      sass: {
        includePaths: [path.resolve(__dirname, './node_modules/compass-mixins/lib')]
      }
    }
  },
  devServer: {
    proxy: 'http://localhost:8888',
    port: 8888
  }
}