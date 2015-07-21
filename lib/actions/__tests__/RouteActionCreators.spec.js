/* global describe, it */

import expect from 'expect.js';

import RouteActionCreators from '../RouteActionCreators.js';
import RouteStore from '../../stores/RouteStore.js';

describe('RouteActionCreators', function () {

  describe('#changeRoute', function () {
    it('exists', function () {
      expect(RouteActionCreators.changeRoute).to.be.ok();
      expect(RouteActionCreators.changeRoute).to.be.a('function');
    });

    it('sets the current route', function () {
      RouteActionCreators.changeRoute('#cool-route-1', 'my-cool-route');

      expect(RouteStore.getRouteName()).to.be('my-cool-route');
      expect(RouteStore.getRouteParams()).to.be.an('array');
      expect(RouteStore.getRouteParams().length).to.be(0);
      expect(RouteStore.getURL()).to.be('#cool-route-1');
    });

    it('sets the current route (with params)', function () {
      RouteActionCreators.changeRoute('#cool-route-2/id', 'my-cool-route-2', ['id']);

      expect(RouteStore.getRouteName()).to.be('my-cool-route-2');
      expect(RouteStore.getRouteParams()).to.be.an('array');
      expect(RouteStore.getRouteParams().length).to.be(1);
      expect(RouteStore.getRouteParams()[0]).to.be('id');
      expect(RouteStore.getURL()).to.be('#cool-route-2/id');
    });
  });

});
