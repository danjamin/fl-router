import RouteDispatcher from '../dispatcher/RouteDispatcher.js';
import RouteActionTypes from '../RouteActionTypes.js';

export default {
  changeRoute: function (name /*, params... */) {
    var params = Array.prototype.slice.call(arguments, 1);

    RouteDispatcher.dispatch({
      type: RouteActionTypes.ROUTE_CHANGED,
      name: name,
      params: params
    });
  }
};
