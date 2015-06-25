/* global describe, it, expect */

import {Router as R, RouteActions as RA} from 'lib/main.js';
import RouteActions from 'lib/actions/RouteActions.js';
import router from 'lib/router.js';

describe('fl-router', function () {

  describe('exports', function () {

    it('contains Router', function () {
      expect(R).toBeDefined();
      expect(R).toBe(router);
    });

    it('contains RouteActions', function () {
      expect(RA).toBeDefined();
      expect(RA).toBe(RouteActions);
    });

  });

});
