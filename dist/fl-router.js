(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fl-store'), require('underscore'), require('backbone')) :
  typeof define === 'function' && define.amd ? define(['exports', 'fl-store', 'underscore', 'backbone'], factory) :
  factory((global.FLRouter = {}), global.Store, global._, global.Backbone)
}(this, function (exports, Store, _, Backbone) { 'use strict';

  Store = ('default' in Store ? Store['default'] : Store);
  _ = ('default' in _ ? _['default'] : _);
  Backbone = ('default' in Backbone ? Backbone['default'] : Backbone);

  var _routeName,
    _routeParams;

  var RouteStore = _.extend({}, Store, {
    setRoute: function (name, params) {
      if (!name) {
        throw 'RouteStore#setRoute requires a name';
      }

      if (typeof name !== 'string') {
        throw 'RouteStore#setRoute name must be a string';
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

  var Router = {
    router: router,
    start: start
  };

  exports.Router = Router;

  var RouteActions = {
    linkTo: function (name, params) {
      RouteStore.setRoute(name, params);
    }
  };

  exports.RouteActions = RouteActions;



}));