import RouteActionCreators from './actions/RouteActionCreators.js';
import Backbone from 'backbone';

// private vars
var _router,
  _routes,
  _beforeCallbacks = [],
  _afterCallbacks = [],
  _alreadyStarted = false,

  // private functions
  _registerRoutes,
  _handleRoute,

  // public vars

  // public functions
  start,
  linkTo,
  beforeEach,
  afterEach,
  clearEach;

// instantiate the router
_router = new Backbone.Router();

// register the routes in this closure and with the router
_registerRoutes = function (routesConfig) {
  _routes = routesConfig;

  // register routes
  for (var name in _routes) {
    if (_routes.hasOwnProperty(name)) {
      _router.route(_routes[name].path, name);
      _router.on('route:' + name, _handleRoute.bind(null, name, _routes[name].route));
    }
  }
};

// handle a specific route
_handleRoute = function (name, route /*, paramSplat */) {
  var paramSplat = Array.prototype.slice.call(arguments, 2);

  _beforeCallbacks.forEach(function (callback) {
    callback(name);
  });

  route.apply(null, paramSplat);

  _afterCallbacks.forEach(function (callback) {
    callback(name);
  });
};

/**
 * Registers the passed in routes and starts listening for route changes.
 *
 * @param object routesConfig The name => path config for your application routes.
 * @param object options The options (pushState {bool}, root {string})
 *  see Backbone.history.start for more information.
 */
start = function (routesConfig, options) {
  // only ever allow starting once
  if (_alreadyStarted) {
    return;
  }

  // default options to empty object
  options = options ? options : {};

  _alreadyStarted = true;

  _registerRoutes(routesConfig);

  Backbone.history.start({
    pushState: options.hasOwnProperty('pushState') ? options.pushState : false,
    root: options.hasOwnProperty('root') ? options.root : "/"
  });
};

/**
 * Links to a route by name, passing in the named parameters.
 * @param string name The name of the route to link to.
 * @param object namedParams The named parameters to pass to the route
 */
linkTo = function (name, namedParams) {
  // TODO: write this better!! handle edge cases (e.g. optional params)
  var newRoute;

  if (!_routes.hasOwnProperty(name)) {
    throw 'Error: unknown route name';
  }

  newRoute = _routes[name].path;

  // replace each param in the route by name
  for (var paramName in namedParams) {
    if (namedParams.hasOwnProperty(paramName)) {
      newRoute = newRoute.replace(':' + paramName, namedParams[paramName]);
    }
  }

  _router.navigate(newRoute, {trigger: true});
};

/**
 * Register a callback to be invoked before each route.
 * This callback will be passed the string name of the route
 * that is about to be invoked.
 * @param func callback
 */
beforeEach = function (callback) {
  _beforeCallbacks.push(callback);
};


/**
 * Register a callback to be invoked after each route.
 * This callback will be passed the string name of the route
 * that is was just invoked.
 * @param func callback
 */
afterEach = function (callback) {
  _afterCallbacks.push(callback);
};

/**
 * Clears every single user defined each callback.
 * Preserves RouteActionCreaters.changeRoute afterEach callback
 */
clearEach = function () {
  _beforeCallbacks.splice(0);
  _afterCallbacks.splice(1); // remove all but first entry
};

// Trigger changeRoute after each route
afterEach(function (name) {
  RouteActionCreators.changeRoute(name);
});

export default {
  start: start,
  linkTo: linkTo,
  beforeEach: beforeEach,
  afterEach: afterEach,
  clearEach: clearEach
};
