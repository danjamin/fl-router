/* global describe, it, expect, jasmine, beforeAll, afterEach */

import Router from 'lib/router.js';

describe('Router', function () {
  var routes,
    ResetRoute = jasmine.createSpy(),
    IndexRoute = jasmine.createSpy(),
    MailboxRoute = jasmine.createSpy(),
    started = false;

  beforeAll(function () {
    routes = {
      reset: {
        path: '_reset_',
        route: ResetRoute
      },

      index: {
        path: '',
        route: IndexRoute
      },

      mailbox: {
        path: 'box/:mailboxId',
        route: MailboxRoute
      },

      message: {
        path: 'box/:mailboxId/message/:messageId',
        route: MailboxRoute
      }
    };
  });

  afterEach(function () {
    Router.clearEach();

    if (started) {
      Router.linkTo('reset');
    }

    ResetRoute.calls.reset();
    IndexRoute.calls.reset();
    MailboxRoute.calls.reset();
  });

  it('has the right properties', function () {
    expect(Router).toBeDefined();
    expect(typeof Router.start === 'function').toBe(true);
    expect(typeof Router.linkTo === 'function').toBe(true);
    expect(typeof Router.beforeEach === 'function').toBe(true);
    expect(typeof Router.afterEach === 'function').toBe(true);
    expect(typeof Router.clearEach === 'function').toBe(true);
  });

  it('should initially invoke the index route', function () {
    Router.start(routes);
    started = true;

    // index route called once
    expect(IndexRoute.calls.count()).toBe(1);

    // mailbox route not called
    expect(MailboxRoute).not.toHaveBeenCalled();
  });

  it('should NOT linkTo reset when there already', function () {
    Router.linkTo('reset');

    expect(ResetRoute).not.toHaveBeenCalled();
    expect(IndexRoute).not.toHaveBeenCalled();
    expect(MailboxRoute).not.toHaveBeenCalled();
  });

  it('should linkTo mailbox from index', function () {
    Router.linkTo('mailbox', {mailboxId: 5});

    expect(IndexRoute).not.toHaveBeenCalled();
    expect(MailboxRoute).toHaveBeenCalledWith('5', null);
  });

  it('should linkTo index from mailbox', function () {
    Router.linkTo('index');

    expect(IndexRoute).toHaveBeenCalledWith(null);
    expect(MailboxRoute).not.toHaveBeenCalled();
  });

  it('should linkTo message from mailbox', function () {
    Router.linkTo('message', {
      mailboxId: 5,
      messageId: 2
    });

    expect(IndexRoute).not.toHaveBeenCalled();
    expect(MailboxRoute).toHaveBeenCalledWith('5', '2', null);
  });

  it('should linkTo mailbox from message', function () {
    Router.linkTo('mailbox', {mailboxId: 5});

    expect(IndexRoute).not.toHaveBeenCalled();
    expect(MailboxRoute).toHaveBeenCalledWith('5', null);
  });

  it('should call beforeEach', function () {
    var spy = jasmine.createSpy();
    Router.beforeEach(spy);

    Router.linkTo('index');

    expect(IndexRoute).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('index');
  });

  it('should call afterEach', function () {
    var spy = jasmine.createSpy();
    Router.afterEach(spy);

    Router.linkTo('index');

    expect(IndexRoute).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('index');
  });

  it('should call multiple beforeEach and afterEach', function () {
    var spy1 = jasmine.createSpy();
    var spy2 = jasmine.createSpy();
    var spy3 = jasmine.createSpy();

    Router.beforeEach(spy1);
    Router.beforeEach(spy2);
    Router.afterEach(spy2);
    Router.afterEach(spy3);

    Router.linkTo('index');

    expect(IndexRoute).toHaveBeenCalled();

    expect(spy1).toHaveBeenCalledWith('index');
    expect(spy2).toHaveBeenCalledWith('index');
    expect(spy3).toHaveBeenCalledWith('index');

    expect(spy1.calls.count()).toEqual(1);
    expect(spy2.calls.count()).toEqual(2);
    expect(spy3.calls.count()).toEqual(1);
  });
});
