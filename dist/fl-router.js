(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('flux'), require('backbone'), require('fl-store'), require('underscore')) :
  typeof define === 'function' && define.amd ? define(['exports', 'flux', 'backbone', 'fl-store', 'underscore'], factory) :
  factory((global.FLRouter = {}), global.flux, global.Backbone, global.Store, global._)
}(this, function (exports, flux, Backbone, Store, _) { 'use strict';

  Backbone = ('default' in Backbone ? Backbone['default'] : Backbone);
  Store = ('default' in Store ? Store['default'] : Store);
  _ = ('default' in _ ? _['default'] : _);

  var RouteDispatcher = new flux.Dispatcher();

  var RouteActionTypes = {
    ROUTE_CHANGED: 'ROUTE_CHANGED'
  };

  var RouteActionCreators = {
    changeRoute: function (name /*, params... */) {
      var params = Array.prototype.slice.call(arguments, 1);

      RouteDispatcher.dispatch({
        type: RouteActionTypes.ROUTE_CHANGED,
        name: name,
        params: params
      });
    }
  };

  var router,
    start,
    routes,
    linkTo;

  router = new Backbone.Router();

  start = function (routesConfig) {
    routes = routesConfig;

    // register routes
    for (var name in routes) {
      if (routes.hasOwnProperty(name)) {
        router.route(routes[name].path, name);
        router.on('route:' + name, routes[name].route);
        router.on('route:' + name, RouteActionCreators.changeRoute.bind(this, name));
      }
    }

    Backbone.history.start({
      pushState: false,
      root: "/"
    });
  };

  // TODO: write this better!! handle edge cases
  linkTo = function (name, paramsObject) {
    var newRoute;

    if (!routes.hasOwnProperty(name)) {
      throw 'Error: unknown route name';
    }

    newRoute = routes[name].path;

    // replace each param in the route by name
    for (var paramName in paramsObject) {
      if (paramsObject.hasOwnProperty(paramName)) {
        newRoute = newRoute.replace(':' + paramName, paramsObject[paramName]);
      }
    }

    router.navigate(newRoute, {trigger: true});
  };

  var Router = {
    router: router,
    linkTo: linkTo,
    start: start
  };

  exports.Router = Router;

  var RouteStore;

  var _routeName,
    _routeParamsArray;

  function _setRoute(name, params) {
    _routeName = name;
    _routeParamsArray = params;
  }

  RouteStore = _.extend({}, Store, {
    getRouteName: function () {
      return _routeName;
    },

    getRouteParams: function () {
      return _routeParamsArray;
    }
  });

  RouteStore.dispatchToken = RouteDispatcher.register(function (action) {
    switch (action.type) {
      case RouteActionTypes.ROUTE_CHANGED:
        _setRoute(action.name, action.params);
        RouteStore.emitChange();
        break;

      default:
        // do nothing
    }
  });

  exports.RouteStore = RouteStore;



}));