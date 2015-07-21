/* global require, module */

var ES6Modules = require('broccoli-es6modules'),
  filterReact = require('broccoli-react'),
  Funnel = require('broccoli-funnel');

var moduleName = 'FLRouter',
  fileName = 'fl-router';

var tree = 'lib';

tree = filterReact(tree, {
  extensions: ['js'],
  transform: {
    es6module: true
  }
});
tree = new ES6Modules(tree, {
  format: 'umd',
  bundleOptions: {
    entry: 'main.js',
    name: moduleName
  },
  esperantoOptions: {
    strict: true
  }
});

tree = new Funnel(tree, {
  destDir: '',

  getDestinationPath: function(relativePath) {
    if (relativePath === moduleName + '.js') {
      return fileName + '.js';
    }

    return relativePath;
  }
});

module.exports = tree;
