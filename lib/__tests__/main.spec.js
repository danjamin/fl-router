/* global describe, it */

var expect = require('expect.js');
var main = require('../main.js');

var R = main.Router;
var RS = main.RouteStore;
var LT = main.LinkTo;

var Router = require('../router.js');
var RouteStore = require('../stores/RouteStore.js');
var LinkTo = require('../components/LinkTo.js');

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
