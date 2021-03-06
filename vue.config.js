const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          loader: 'ware-loader',
          enforce: 'pre',
          options: {
            raw: true,
            middleware: function(source) {
              return `<template><div>${md.render(source)}</div></template>`;
            },
          },
        },
        {
          test: /\.md$/,
          use: 'vue-loader',
        },
      ],
    },
    plugins: (() => {
      const result = [];
      if (process.env.VUE_APP_MODE !== 'local') {
        result.push(
          new CompressionWebpackPlugin({
            filename: '[path]',
            algorithm: 'gzip',
            test: /\.js$/,
            threshold: 0,
          }),
        );
      }
      return result;
    })(),
  },
  pages: {
    index: {
      entry: 'src/pages/index/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Index Page',
      // chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    search: {
      entry: 'src/pages/search/main.js',
      template: 'public/search.html',
      filename: 'search.html',
      title: 'Search Page',
      // chunks: ['chunk-vendors', 'chunk-common', 'intro']
    },
    upload: {
      entry: 'src/pages/upload/main.js',
      template: 'public/upload.html',
      filename: 'upload.html',
      title: 'Upload Page',
      // chunks: ['chunk-vendors', 'chunk-common', 'intro']
    },
    history: {
      entry: 'src/pages/history/main.js',
      template: 'public/history.html',
      filename: 'history.html',
      title: 'history Page',
      // chunks: ['chunk-vendors', 'chunk-common', 'intro']
    },
    setting: {
      entry: 'src/pages/setting/main.js',
      template: 'public/setting.html',
      filename: 'setting.html',
      title: 'Setting Page',
      // chunks: ['chunk-vendors', 'chunk-common', 'intro']
    },
    article: {
      entry: 'src/pages/article/main.js',
      template: 'public/article.html',
      filename: 'article.html',
      title: 'Article Page',
      // chunks: ['chunk-vendors', 'chunk-common', 'intro']
    },
    login: {
      entry: 'src/pages/login/main.js',
      template: 'public/login.html',
      filename: 'login.html',
      title: 'Login Page',
      // chunks: ['chunk-vendors', 'chunk-common', 'intro']
    },
    intro: {
      entry: 'src/pages/intro/main.js',
      template: 'public/intro.html',
      filename: 'intro.html',
      title: 'Intro Page',
      // chunks: ['chunk-vendors', 'chunk-common', 'intro']
    },
  },
  css: {
    loaderOptions: {
      sass: {
        includePaths: [
          path.resolve(__dirname, './node_modules/compass-mixins/lib'),
        ],
      },
    },
  },
  devServer: {
    proxy: 'http://localhost:8888',
    port: 8888,
  },
};
