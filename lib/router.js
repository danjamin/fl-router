var LocationBar = require('location-bar');
var RouteRecognizer = require('route-recognizer');
var Promise = require('es6-promise').Promise;

var RouteActionCreators = require('./actions/RouteActionCreators.js');
var routeURLResolver = require('./utils/routeURLResolver.js');

// private vars
var _locationBar,
  _router,
  _routes,
  _beforeCallbacks = [],
  _afterCallbacks = [],
  _alreadyStarted = false,
  _isServerSide = false,
  _pushState = false,
  _rootURL,

  // private functions
  _registerRoutes,
  _handleRoute,
  _handlePath,
  _setupLocationBar,

  // public vars

  // public functions
  start,
  getURLFromRoute,
  isMatch,
  linkTo,
  linkToURL,
  transitionTo,
  beforeEach,
  afterEach,
  clearEach;

// instantiate the route recognizer
// we always need to do this regardless of client/server
_router = new RouteRecognizer();

// register the routes in this closure and with the router
_registerRoutes = function (routesConfig) {
  _routes = routesConfig;

  // register routes
  for (var name in _routes) {
    if (_routes.hasOwnProperty(name)) {
      _router.add([{
        path: _routes[name].path,
        handler: _handleRoute.bind(null, name, _routes[name].route)
      }], { as: name });
    }
  }
};

// handle a specific route
// returns array of promises
_handleRoute = function (name, route, params) {
  var promises;

  _beforeCallbacks.forEach(function (callback) {
    callback(name, params);
  });

  promises = route.apply(null, params);

  if (Object.prototype.toString.call(promises) !== '[object Array]') {
    // ensure we are dealing with an array going forward
    promises = [promises];
  }

  _afterCallbacks.forEach(function (callback) {
    callback(name, params);
  });

  return promises;
};

// handles a specific path and triggers the route handler
// returns promise array from the route
_handlePath = function (path) {
  var paramArr;
  var matches = _router.recognize(path);
  var match;
  var promises;

  for (var i = 0, iMax = matches.length; i < iMax; ++i) {
    match = matches[i];
    paramArr = [];

    // TODO: is key order gaurenteed?
    // should consider changing API to key => value params?
    for (var key in match.params) {
      if (match.params.hasOwnProperty(key)) {
        paramArr.push(match.params[key]);
      }
    }

    promises = match.handler(paramArr);
  }

  return promises;
};

// setup the location bar and start watching it
_setupLocationBar = function () {
  // instantiate the location bar
  _locationBar = new LocationBar();

  // trigger the route recognizer on location bar change
  _locationBar.onChange(_handlePath);

  // start watching the location bar
  _locationBar.start({
    pushState: _pushState,
    root: _rootURL
  });
};

/**
 * Registers the passed in routes and starts listening for route changes.
 * Pass isServerSide true when on the server to setup the router for the server side
 *
 * @param object routesConfig The name => path config for your application routes.
 * @param object options The options (pushState {bool}, root {string}, isServerSide {bool})
 * @returns mixed Returns null client-side, returns promise array server side during pre render
 */
start = function (routesConfig, options) {
  if (_alreadyStarted) {
    // only ever allow starting once
    return;
  }

  _alreadyStarted = true;

  // default options to empty object
  options = options ? options : {};

  _isServerSide = options.hasOwnProperty('isServerSide') ? !!options.isServerSide : false;
  _pushState = options.hasOwnProperty('pushState') ? !!options.pushState : false;
  _rootURL = options.hasOwnProperty('root') ? options.root : "/";

  _registerRoutes(routesConfig);

  if (_isServerSide === false) {
    _setupLocationBar();
  }
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

  return (!_pushState ? '#' : '/') + routeURLResolver(path, params);
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
  linkToURL(url);
};

/**
 * Links to a url
 * @param string url The url
 * @returns mixed A promise when on the server, else undefined
 */
linkToURL = function (url) {
  if (_isServerSide === true) {
    return Promise.all(_handlePath(url));
  } else {
    _locationBar.update(url, {trigger: true});
  }
};

/**
 * Transitions to route, url, and params based on a route by name, passing in the array of parameters.
 * Similar to linkTo -- except that browser location and history are unaffected
 *
 * @param string name The name of the route to transition to.
 * @param array params The list of parameters include in the rewritten URL
 */
transitionTo = function (name, params) {
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
  _beforeCallbacks.splice(1); // remove all but first entry
  _afterCallbacks.splice(0);
};

// Trigger changeRoute before each route is triggered
// this is important as some routes want to call transitionTo
// overriding this call!
beforeEach(function (name, params) {
  transitionTo(name, params);
});

module.exports = {
  start: start,
  getURLFromRoute: getURLFromRoute,
  isMatch: isMatch,
  linkTo: linkTo,
  linkToURL: linkToURL,
  transitionTo: transitionTo,
  beforeEach: beforeEach,
  afterEach: afterEach,
  clearEach: clearEach
};
