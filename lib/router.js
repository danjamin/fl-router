(function () {
  'use strict';

  // modified returnExports UMD (no global)
  if (typeof define === 'function' && define.amd) {
    /* global define */

    // AMD
    define([
      './stores/RouteStore',
      'backbone'],
      factory
    );
  } else if (typeof exports === 'object') {
    /* global module, require */

    // Node
    module.exports = factory(
      require('./stores/RouteStore'),
      require('backbone')
    );
  }
  function factory(RouteStore, Backbone) {
    var router,
      start,
      routes,
      _linkTo,
      _onChange;

    router = new Backbone.Router();

    function getStateFromStores() {
      return {
        routeName: RouteStore.getRouteName(),
        routeParams: RouteStore.getRouteParams()
      };
    }

    start = function (routesConfig) {
      routes = routesConfig;

      // register routes
      for (var name in routes) {
        if (routes.hasOwnProperty(name)) {
          router.route(routes[name].path, name);
          router.on('route:' + name, routes[name].route);
        }
      }

      Backbone.history.start({
        pushState: false,
        root: "/"
      });

      // listen for changes to the route store
      RouteStore.addChangeListener(_onChange);
    };

    // TODO: write this better!! handle edge cases
    _linkTo = function (name, params) {
      var newRoute;

      if (!routes.hasOwnProperty(name)) {
        throw 'Error: unknown route name';
      }

      newRoute = routes[name].path;

      // replace each param in the route by name
      for (var paramName in params) {
        if (params.hasOwnProperty(paramName)) {
          newRoute = newRoute.replace(':' + paramName, params[paramName]);
        }
      }

      router.navigate(newRoute, {trigger: true});
    };

    _onChange = function () {
      var state = getStateFromStores();
      _linkTo(state.routeName, state.routeParams);
    };

    return {
      router: router,
      start: start
    };
  }

})();
