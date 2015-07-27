/* global require, module */

var ES6Modules = require('broccoli-es6modules'),
  filterReact = require('broccoli-react');

var tree = 'lib';

tree = filterReact(tree, {
  extensions: ['js'],
  transform: {
    es6module: true
  }
});
tree = new ES6Modules(tree, {
  format: 'cjs',
  bundleOptions: {
    entry: 'main.js',
    name: 'fl-router'
  },
  esperantoOptions: {
    strict: true
  }
});

module.exports = tree;
