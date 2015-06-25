import RouteStore from '../stores/RouteStore.js';

export default {
  linkTo: function (name, params) {
    RouteStore.setRoute(name, params);
  }
};
