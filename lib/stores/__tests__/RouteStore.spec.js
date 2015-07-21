/* global describe, it */

import expect from 'expect.js';

import RouteStore from '../RouteStore.js';

describe('RouteStore', function () {
  it('has the right properties', function () {
    expect(RouteStore).to.be.ok();
    expect(RouteStore.getRouteName).to.be.a('function');
    expect(RouteStore.getRouteParams).to.be.a('function');
    expect(RouteStore.getURL).to.be.a('function');
  });
});
