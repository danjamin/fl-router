import {Store} from 'fl-store';
import RouteDispatcher from '../dispatcher/RouteDispatcher.js';
import RouteActionTypes from '../RouteActionTypes.js';
import objectAssign from 'object-assign';

var RouteStore;

var _routeName,
  _routeParams,
  _url = '';

function _setRoute(url, name, params) {
  _url = url;
  _routeName = name;
  _routeParams = params ? params : [];
}

RouteStore = objectAssign({}, Store, {
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

export default RouteStore;
