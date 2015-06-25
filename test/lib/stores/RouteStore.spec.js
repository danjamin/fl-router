/* global describe, it, expect, afterEach */

import RouteStore from 'lib/stores/RouteStore.js';

describe('RouteStore', function () {
  afterEach(function () {
    RouteStore.clearRoute();
  });

  it('has the right properties', function () {
    expect(RouteStore).toBeDefined();
    expect(typeof RouteStore.setRoute === 'function').toBe(true);
    expect(typeof RouteStore.clearRoute === 'function').toBe(true);
    expect(typeof RouteStore.getRouteName === 'function').toBe(true);
    expect(typeof RouteStore.getRouteParams === 'function').toBe(true);
  });

  it('sets the current route', function () {
    expect(RouteStore.getRouteName()).toBeUndefined();
    expect(RouteStore.getRouteParams()).toBeUndefined();

    RouteStore.setRoute('my-cool-route');

    expect(RouteStore.getRouteName()).toBe('my-cool-route');
  });

  it('sets the current route (with params)', function () {
    var params = {param: 1};

    expect(RouteStore.getRouteName()).toBeUndefined();
    expect(RouteStore.getRouteParams()).toBeUndefined();

    RouteStore.setRoute('my-cool-route', params);

    expect(RouteStore.getRouteName()).toBe('my-cool-route');
    expect(RouteStore.getRouteParams()).toBe(params);
  });

  it('handles when name is undefined', function () {
    expect(function () { RouteStore.setRoute(); }).toThrow('RouteStore#setRoute requires a name');
  });

  it('handles when name is not a string', function () {
    expect(function () { RouteStore.setRoute(5); }).toThrow('RouteStore#setRoute name must be a string');
  });
});
