/* global describe, it, expect */

import FlRouter from 'lib/main.js';
import RouteActions from 'lib/actions/RouteActions.js';
import Router from 'lib/router.js';

describe('fl-router', function () {

  describe('exports', function () {

    it('contains .Router', function () {
      expect(FlRouter.Router).toBeDefined();
      expect(FlRouter.Router).toBe(Router);
    });

    it('contains .RouteActions', function () {
      expect(FlRouter.RouteActions).toBeDefined();
      expect(FlRouter.RouteActions).toBe(RouteActions);
    });

    it('does not contain .RouteStore', function () {
      expect(FlRouter.RouteStore).toBeUndefined();
    });

  });

});
