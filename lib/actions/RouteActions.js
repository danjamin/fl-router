(function () {
  'use strict';

  // modified returnExports UMD (no global)
  if (typeof define === 'function' && define.amd) {
    /* global define */

    // AMD
    define([
      '../stores/RouteStore'],
      factory
    );
  } else if (typeof exports === 'object') {
    /* global module, require */

    // Node
    module.exports = factory(
      require('../stores/RouteStore')
    );
  }
  function factory(RouteStore) {
    return {
      linkTo: function (name, params) {
        RouteStore.setRoute(name, params);
      }
    };
  }

})();
