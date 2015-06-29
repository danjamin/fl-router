/* global describe, it, expect */

import RouteActionCreators from 'lib/actions/RouteActionCreators.js';
import RouteStore from 'lib/stores/RouteStore.js';

describe('RouteActionCreators', function () {

  describe('#changeRoute', function () {
    it('exists', function () {
      expect(RouteActionCreators.changeRoute).toBeDefined();
      expect(typeof RouteActionCreators.changeRoute === 'function').toBe(true);
    });

    it('sets the current route', function () {
      RouteActionCreators.changeRoute('my-cool-route');
      expect(RouteStore.getRouteName()).toBe('my-cool-route');
    });

    it('sets the current route (with params)', function () {
      RouteActionCreators.changeRoute('my-cool-route-2', 1);

      expect(RouteStore.getRouteName()).toBe('my-cool-route-2');
      expect(RouteStore.getRouteParams()[0]).toBe(1);
    });
  });

});
