System.config({
  baseURL: '/',

  paths: {
    babel: 'node_modules/babel-core/browser.js',
    'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js',
    systemjs: 'node_modules/systemjs/dist/system.js',
    'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',

    backbone: 'bower_components/backbone/backbone.js',
    'fl-store': 'bower_components/fl-store/lib/main.js',
    jquery: 'bower_components/jquery/dist/jquery.js',
    underscore: 'bower_components/underscore/underscore.js'
  },

  transpiler: 'babel'
});
