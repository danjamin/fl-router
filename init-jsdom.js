/* global require, global */

var jsdom = require('jsdom').jsdom;

if (typeof document === 'undefined') {
  global.document = jsdom('<!doctype html><html><body></body></html>');
  global.window = document.parentWindow;
  global.navigator = {
    userAgent: 'node.js'
  };
}
