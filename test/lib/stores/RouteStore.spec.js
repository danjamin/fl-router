/* global describe, it, expect */

import RouteStore from 'lib/stores/RouteStore.js';

describe('RouteStore', function () {
  it('has the right properties', function () {
    expect(RouteStore).toBeDefined();
    expect(typeof RouteStore.getRouteName === 'function').toBe(true);
    expect(typeof RouteStore.getRouteParams === 'function').toBe(true);
  });
});
