import Backbone from 'backbone';

import RouteActionCreators from './actions/RouteActionCreators.js';
import routeURLResolver from './utils/routeURLResolver.js';

// private vars
var _router,
  _routes,
  _beforeCallbacks = [],
  _afterCallbacks = [],
  _alreadyStarted = false,
  _pushState = false,
  _rootURL,

  // private functions
  _registerRoutes,
  _handleRoute,

  // public vars

  // public functions
  start,
  getURLFromRoute,
  isMatch,
  linkTo,
  rewriteTo,
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
  var params = Array.prototype.slice.call(arguments, 2);

  // remove the trailing null that Backbone adds!
  params.pop();

  _beforeCallbacks.forEach(function (callback) {
    callback(name, params);
  });

  route.apply(null, params);

  _afterCallbacks.forEach(function (callback) {
    callback(name, params);
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

  _pushState = options.hasOwnProperty('pushState') ? options.pushState : false;
  _rootURL = options.hasOwnProperty('root') ? options.root : "/";

  _registerRoutes(routesConfig);

  Backbone.history.start({
    pushState: _pushState,
    root: _rootURL
  });
};

/**
 * Gets the URL from a route by name and params array.
 * @param string name The name of the route (e.g. 'index')
 * @param params array The array of params for this route (e.g. [5])
 * @return string The URL (prefixed with '#' if not using pushState)
 */
getURLFromRoute = function (name, params) {
  var path;

  if (!_routes.hasOwnProperty(name)) {
    throw 'Error: unknown route name given to Router.getURLFromRoute()';
  }

  path = _routes[name].path;

  return (!_pushState ? '#' : '') + routeURLResolver(path, params);
};

// TODO: write tests for this function!
/**
 * Whether or not url is a match of activeURL.  When matchPartial is true,
 * if url is a subset of activeUrl, then it is considered a match.
 *
 * @param string url The url to test.
 * @param string activeURL The active URL to test against
 * @param bool matchPartial Whether or not url subset of activeURL is a match.
 * @return bool True when match, else false
 */
isMatch = function (url, activeURL, matchPartial) {
  if (url === activeURL) {
    return true;
  }

  if (matchPartial) {
    return activeURL.indexOf(url) === 0;
  }

  return false;
};

/**
 * Links to a route by name, passing in the array of parameters.
 * @param string name The name of the route to link to.
 * @param array params The list of parameters to pass to the route
 */
linkTo = function (name, params) {
  var url = getURLFromRoute(name, params);
  _router.navigate(url, {trigger: true});
};

/**
 * Rewrites route, url, and params based on a route by name, passing in the array of parameters.
 * Similar to linkTo -- except that browser location and history are unaffected
 *
 * @param string name The name of the route to rewrite to.
 * @param array params The list of parameters include in the rewritten URL
 */
rewriteTo = function (name, params) {
  var url = getURLFromRoute(name, params);
  RouteActionCreators.changeRoute(url, name, params);
};

/**
 * Register a callback to be invoked before each route.
 * This callback will be passed: name {string}, params {array}
 * @param func callback
 */
beforeEach = function (callback) {
  _beforeCallbacks.push(callback);
};

/**
 * Register a callback to be invoked after each route.
 * This callback will be passed: name {string}, params {array}
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
afterEach(function (name, params) {
  rewriteTo(name, params);
});

export default {
  start: start,
  getURLFromRoute: getURLFromRoute,
  isMatch: isMatch,
  linkTo: linkTo,
  rewriteTo: rewriteTo,
  beforeEach: beforeEach,
  afterEach: afterEach,
  clearEach: clearEach
};
