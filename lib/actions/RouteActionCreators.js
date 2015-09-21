var RouteDispatcher = require('../dispatcher/RouteDispatcher.js');
var RouteActionTypes = require('../RouteActionTypes.js');

module.exports = {
  changeRoute: function (url, name, params) {
    RouteDispatcher.dispatch({
      type: RouteActionTypes.ROUTE_CHANGED,
      url: url,
      name: name,
      params: params
    });
  }
};
