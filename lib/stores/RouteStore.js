(function () {
  'use strict';

  // modified returnExports UMD (no global)
  if (typeof define === 'function' && define.amd) {
    /* global define */

    // AMD
    define([
      'fl-store',
      'underscore'],
      factory
    );
  } else if (typeof exports === 'object') {
    /* global module, require */

    // Node
    module.exports = factory(
      require('fl-store'),
      require('underscore')
    );
  }
  function factory(Store, _) {
    var _routeName,
      _routeParams;

    return  _.extend({}, Store, {
      setRoute: function (name, params) {
        if (!name) {
          throw 'RouteStore#setRoute requires a name';
        }

        _routeName = name;
        _routeParams = params;
        this.emitChange();
      },

      clearRoute: function () {
        _routeName = undefined;
        _routeParams = undefined;
      },

      getRouteName: function () {
        return _routeName;
      },

      getRouteParams: function () {
        return _routeParams;
      }
    });
  }

})();
