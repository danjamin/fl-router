/* global describe, it, expect, beforeEach */

import RouteActions from 'lib/actions/RouteActions.js';
import RouteStore from 'lib/stores/RouteStore.js';

describe('RouteActions', function () {

  describe('#linkTo', function () {
    beforeEach(function () {
      RouteStore.clearRoute();
    });

    it('exists', function () {
      expect(RouteActions.linkTo).toBeDefined();
      expect(typeof RouteActions.linkTo === 'function').toBe(true);
    });

    it('sets the current route', function () {
      expect(RouteStore.getRouteName()).toBeUndefined();
      expect(RouteStore.getRouteParams()).toBeUndefined();

      RouteActions.linkTo('my-cool-route');

      expect(RouteStore.getRouteName()).toBe('my-cool-route');
    });

    it('sets the current route (with params)', function () {
      var params = {param: 1};

      expect(RouteStore.getRouteName()).toBeUndefined();
      expect(RouteStore.getRouteParams()).toBeUndefined();

      RouteActions.linkTo('my-cool-route', params);

      expect(RouteStore.getRouteName()).toBe('my-cool-route');
      expect(RouteStore.getRouteParams()).toBe(params);
    });
  });

});
