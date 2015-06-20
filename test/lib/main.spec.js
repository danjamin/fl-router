/* global define, describe, it, expect */

define(function (require) {
  var main = require('lib'),
    RouteActions = require('lib/actions/RouteActions'),
    Router = require('lib/router');

  describe('main', function () {

    describe('exports', function () {
      
      it('contains .Router', function () {
        expect(main.Router).toBeDefined();
        expect(main.Router).toBe(Router);
      });

      it('contains .RouteActions', function () {
        expect(main.RouteActions).toBeDefined();
        expect(main.RouteActions).toBe(RouteActions);
      });

      it('does not contain .RouteStore', function () {
        expect(main.RouteStore).toBeUndefined();
      });

    });

  });
});
