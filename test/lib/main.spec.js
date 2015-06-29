/* global describe, it, expect */

import {
  Router as R,
  RouteStore as RS
} from 'lib/main.js';

import Router from 'lib/router.js';
import RouteStore from 'lib/stores/RouteStore.js';


describe('fl-router', function () {

  it('contains Router', function () {
    expect(R).toBeDefined();
    expect(R).toBe(Router);
  });

  it('contains RouteStore', function () {
    expect(RS).toBeDefined();
    expect(RS).toBe(RouteStore);
  });

});
