(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('backbone'), require('flux'), require('fl-store'), require('underscore'), require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'backbone', 'flux', 'fl-store', 'underscore', 'react'], factory) :
  factory((global.FLRouter = {}), global.Backbone, global.flux, global.fl_store, global._, global.React)
}(this, function (exports, Backbone, flux, fl_store, _, React) { 'use strict';

  Backbone = ('default' in Backbone ? Backbone['default'] : Backbone);
  _ = ('default' in _ ? _['default'] : _);
  React = ('default' in React ? React['default'] : React);

  var RouteDispatcher = new flux.Dispatcher();

  var RouteActionTypes = {
    ROUTE_CHANGED: 'ROUTE_CHANGED'
  };

  var RouteActionCreators = {
    changeRoute: function (url, name, params) {
      RouteDispatcher.dispatch({
        type: RouteActionTypes.ROUTE_CHANGED,
        url: url,
        name: name,
        params: params
      });
    }
  };

  var ROUTE_PARAM_NAME_WHITELIST_CHARS = /[0-9a-zA-Z\_\-]/;
  var ROUTE_PARAM_PREFIX = ':';
  var ROUTE_PARAM_OPTIONAL_PREFIX = '(';
  var ROUTE_PARAM_OPTIONAL_SUFFIX = ')';

  /**
   * Resolves a URL from a given path string and params array
   * Handles optional params like 'mailbox(/:id)'
   * @param string path The path string (e.g. 'mailbox/:id')
   * @param array params The array of params to fill in one by one
   */
  var routeURLResolver = function (path, params) {
    var url,
      paramIndex;

    params = params ? params : [];

    url = '';
    paramIndex = 0;

    // replace each param in the path
    for (var i = 0, iMax = path.length; i < iMax;) {
      switch (path[i]) {
        case ROUTE_PARAM_PREFIX:
          // skip this char
          ++i;

          // if we have separator then try to replace the whole param
          while (i < iMax && ROUTE_PARAM_NAME_WHITELIST_CHARS.test(path[i])) {
            ++i;
          }

          if (paramIndex >= params.length) {
            throw 'Too few params were passed to the routeURLResolver';
          }

          url += params[paramIndex];
          ++paramIndex;
          break;

        case ROUTE_PARAM_OPTIONAL_PREFIX:
          // skip this char
          ++i;

          if (path[i] === '/' && paramIndex < params.length) {
            url += path[i];
            ++i;
          }

          // if we have a starting optional, check if we have params left
          // if no params left, then erase the optional completely
          // if there are params left, then replace optional with param
          while (i < iMax && ROUTE_PARAM_OPTIONAL_SUFFIX !== path[i]) {
            ++i;
          }

          if (paramIndex < params.length) {
            url += params[paramIndex];
            ++paramIndex;
          }
          ++i;
          break;

        default:
          url += path[i];
          ++i;
          break;
      }
    }

    if (paramIndex < params.length) {
      console.warn('Too many params were passed to the routeURLResolver');
    }

    return url;
  }

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
    var url = getURLFromRoute(name, params);
    RouteActionCreators.changeRoute(url, name, params);
  });

  var Router = {
    start: start,
    getURLFromRoute: getURLFromRoute,
    isMatch: isMatch,
    linkTo: linkTo,
    beforeEach: beforeEach,
    afterEach: afterEach,
    clearEach: clearEach
  };

  exports.Router = Router;

  var RouteStore;

  var _routeName,
    _routeParams,
    _url;

  function _setRoute(url, name, params) {
    _url = url;
    _routeName = name;
    _routeParams = params ? params : [];
  }

  RouteStore = _.extend({}, fl_store.Store, {
    /**
     * Gets the current route name
     * @returns string The route name
     */
    getRouteName: function () {
      return _routeName;
    },

    /**
     * Gets the current route params array
     * @returns array The array of params e.g. [5]
     */
    getRouteParams: function () {
      return _routeParams;
    },

    /**
     * Gets the current URL (for comparison purposes)
     * @returns string
     */
    getURL: function () {
      return _url;
    }
  });

  RouteStore.dispatchToken = RouteDispatcher.register(function (action) {
    switch (action.type) {
      case RouteActionTypes.ROUTE_CHANGED:
        _setRoute(action.url, action.name, action.params);
        RouteStore.emitChange();
        break;

      default:
        // do nothing
    }
  });

  exports.RouteStore = RouteStore;

  var LinkTo = React.createClass({
    displayName: 'LinkTo',

    propTypes: {
      // required
      route: React.PropTypes.string.isRequired,

      // optionally add params
      params: React.PropTypes.array,

      // optionally check for active against the activeURL
      activeURL: React.PropTypes.string,

      // match substring
      matchPartial: React.PropTypes.bool,

      // optionally add class name string
      className: React.PropTypes.string
    },

    getDefaultProps: function () {
      return {
        params: [],
        activeURL: null,
        matchPartial: true,
        className: ''
      };
    },

    render: function () {
      /*jshint scripturl:true*/

      var extraProps = {};
      var url = Router.getURLFromRoute(this.props.route, this.props.params);
      var classes = this.props.className ? this.props.className : '';
      var isActive = this.props.activeURL !== null &&
          Router.isMatch(url, this.props.activeURL, this.props.matchPartial);

      if (isActive) {
        classes += ' active';
        url = 'javascript:;';
        extraProps.rel = 'nofollow';
      }

      return (
        React.createElement("a", React.__spread({href: url, className: classes},  extraProps), 
          this.props.children
        )
      );
    }
  });

  exports.LinkTo = LinkTo;



}));