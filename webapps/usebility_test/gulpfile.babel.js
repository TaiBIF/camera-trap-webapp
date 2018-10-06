var elixir = require('laravel-elixir')
require('laravel-elixir-webpack-official');
require('laravel-elixir-vue-2')

elixir.config.sourcemaps = false;
elixir.config.assetsPath = './src';
elixir.config.publicPath = './dist';
elixir.config.css.outputFolder = '/css';

elixir.webpack.mergeConfig({
  babel: {
    presets: ['es2015']
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader:[ 'style-loader', 'css-loader' ]
    }]
  }
});

elixir(function(mix) {

  mix.sass("app.scss")
      .copy('./node_modules/font-awesome/fonts', 'dist/fonts')
      .copy('./src/js/vendor/jqwidgets/jqwidgets/styles/images', 'dist/css/images')
      .copy([
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'src/js/vendor/jqwidgets/jqwidgets/styles/jqx.base.css'
      ], 'dist/css/lib.css')
      .scripts([
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap/dist/js/bootstrap.bundle.js',
        './node_modules/bootstrap/dist/js/bootstrap.js',
        './src/js/vendor/script.js',
      ], 'dist/js/lib.js')
      .copy('src/template/*.html', 'dist/html/')
      .webpack('src/js/main.js')
      .webpack('src/js/history.js')
      .webpack('src/js/search.js')
      .webpack('src/js/upload.js');
});