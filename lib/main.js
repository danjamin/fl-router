(function () {
  'use strict';

  // modified returnExports UMD (no global)
  if (typeof define === 'function' && define.amd) {
    /* global define */

    // AMD
    define([
      './router',
      './actions/RouteActions'],
      factory
    );
  } else if (typeof exports === 'object') {
    /* global module, require */

    // Node
    module.exports = factory(
      require('./router'),
      require('./actions/RouteActions')
    );
  }
  function factory(Router, RouteActions) {
    return {
      Router: Router,
      RouteActions: RouteActions
    };
  }

})();
