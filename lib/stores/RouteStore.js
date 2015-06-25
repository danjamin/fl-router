import Store from 'fl-store';
import _ from 'underscore';

var _routeName,
  _routeParams;

export default _.extend({}, Store, {
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
