/* global describe, it */

import expect from 'expect.js';

import {
  Router as R,
  RouteStore as RS,
  LinkTo as LT
} from '../main.js';

import Router from '../router.js';
import RouteStore from '../stores/RouteStore.js';
import LinkTo from '../components/LinkTo.js';

describe('fl-router', function () {

  it('contains Router', function () {
    expect(R).to.be.ok();
    expect(R).to.be(Router);
  });

  it('contains RouteStore', function () {
    expect(RS).to.be.ok();
    expect(RS).to.be(RouteStore);
  });

  it('contains LinkTo', function () {
    expect(LT).to.be.ok();
    expect(LT).to.be(LinkTo);
  });

});
