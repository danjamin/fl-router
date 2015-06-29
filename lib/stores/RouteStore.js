import Store from 'fl-store';
import RouteDispatcher from '../dispatcher/RouteDispatcher.js';
import RouteActionTypes from '../RouteActionTypes.js';
import _ from 'underscore';

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

export default RouteStore;
