/* global describe, it */

var expect = require('expect.js');

var routeURLResolver = require('../routeURLResolver.js');

describe('routeURLResolver', function () {
  it('handles and empty path', function () {
    expect(routeURLResolver('')).to.be('');
  });

  it('handles a single required param', function () {
    expect(routeURLResolver('test/:id', [5])).to.be('test/5');
    expect(routeURLResolver('test/:id/', [5])).to.be('test/5/');
  });

  it('handles two required params', function () {
    expect(routeURLResolver('test/:id/other/:otherId', [5, 2])).to.be('test/5/other/2');
    expect(routeURLResolver('test/:id/other/:otherId/', [5, 2])).to.be('test/5/other/2/');

    expect(routeURLResolver('test/:id/:otherId', [5, 2])).to.be('test/5/2');
    expect(routeURLResolver('test/:id/:otherId/', [5, 2])).to.be('test/5/2/');
  });

  it('handles two optional params', function () {
    expect(routeURLResolver('test(/:id)(/:other)', [])).to.be('test');
    expect(routeURLResolver('test(/:id)(/:other)', [1])).to.be('test/1');
    expect(routeURLResolver('test(/:id)(/:other)', [1,2])).to.be('test/1/2');
  });

  it('handles one required and one optional param', function () {
    expect(routeURLResolver('test/:id/o(/:otherId)', [5])).to.be('test/5/o');
    expect(routeURLResolver('test/:id/o(/:otherId)/', [5])).to.be('test/5/o/');
    expect(routeURLResolver('test/:id/o(/:otherId)', [5, 2])).to.be('test/5/o/2');
    expect(routeURLResolver('test/:id/o(/:otherId)/', [5, 2])).to.be('test/5/o/2/');

    expect(routeURLResolver('test/:id(/:otherId)', [5])).to.be('test/5');
    expect(routeURLResolver('test/:id(/:otherId)/', [5])).to.be('test/5/');
    expect(routeURLResolver('test/:id(/:otherId)', [5, 2])).to.be('test/5/2');
    expect(routeURLResolver('test/:id(/:otherId)/', [5, 2])).to.be('test/5/2/');
  });

  it('handles one required and two optional params', function () {
    expect(routeURLResolver('test/:id/o(/:otherId)(/:third)', [3])).to.be('test/3/o');
    expect(routeURLResolver('test/:id/o(/:otherId)(/:third)', [3,2])).to.be('test/3/o/2');
    expect(routeURLResolver('test/:id/o(/:otherId)(/:third)', [3,2,1])).to.be('test/3/o/2/1');

    expect(routeURLResolver('test/:id(/:otherId)(/:third)', [3])).to.be('test/3');
    expect(routeURLResolver('test/:id(/:otherId)(/:third)', [3,2])).to.be('test/3/2');
    expect(routeURLResolver('test/:id(/:otherId)(/:third)', [3,2,1])).to.be('test/3/2/1');
  });
});
