import RouteDispatcher from '../dispatcher/RouteDispatcher.js';
import RouteActionTypes from '../RouteActionTypes.js';

export default {
  changeRoute: function (url, name, params) {
    RouteDispatcher.dispatch({
      type: RouteActionTypes.ROUTE_CHANGED,
      url: url,
      name: name,
      params: params
    });
  }
};
