import RouteActionCreators from './actions/RouteActionCreators.js';
import Backbone from 'backbone';

var router,
  start,
  routes,
  linkTo;

router = new Backbone.Router();

start = function (routesConfig) {
  routes = routesConfig;

  // register routes
  for (var name in routes) {
    if (routes.hasOwnProperty(name)) {
      router.route(routes[name].path, name);
      router.on('route:' + name, routes[name].route);
      router.on('route:' + name, RouteActionCreators.changeRoute.bind(this, name));
    }
  }

  Backbone.history.start({
    pushState: false,
    root: "/"
  });
};

// TODO: write this better!! handle edge cases
linkTo = function (name, paramsObject) {
  var newRoute;

  if (!routes.hasOwnProperty(name)) {
    throw 'Error: unknown route name';
  }

  newRoute = routes[name].path;

  // replace each param in the route by name
  for (var paramName in paramsObject) {
    if (paramsObject.hasOwnProperty(paramName)) {
      newRoute = newRoute.replace(':' + paramName, paramsObject[paramName]);
    }
  }

  router.navigate(newRoute, {trigger: true});
};

export default {
  router: router,
  linkTo: linkTo,
  start: start
};
