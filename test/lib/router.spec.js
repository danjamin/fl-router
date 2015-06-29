/* global describe, it, expect, jasmine, beforeAll, afterEach */

import Router from 'lib/router.js';

describe('Router', function () {
  var routes,
    IndexRoute = jasmine.createSpy(),
    MailboxRoute = jasmine.createSpy();

  beforeAll(function () {
    routes = {
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
    IndexRoute.calls.reset();
    MailboxRoute.calls.reset();
  });

  it('has the right properties', function () {
    expect(Router).toBeDefined();
    expect(Router.router).toBeDefined();
    expect(Router.linkTo).toBeDefined();
    expect(typeof Router.linkTo === 'function').toBe(true);
    expect(typeof Router.start === 'function').toBe(true);
  });

  it('should initially invoke the index route', function () {
    Router.start(routes);

    // index route called once
    expect(IndexRoute.calls.count()).toBe(1);

    // mailbox route not called
    expect(MailboxRoute).not.toHaveBeenCalled();
  });

  it('should NOT linkTo index when there already', function () {
    Router.linkTo('index');

    // index route called once
    expect(IndexRoute).not.toHaveBeenCalled();

    // mailbox route not called
    expect(MailboxRoute).not.toHaveBeenCalled();
  });

  it('should linkTo mailbox from index', function () {
    Router.linkTo('mailbox', {mailboxId: 5});

    // index route called once
    expect(IndexRoute).not.toHaveBeenCalled();

    // mailbox route not called
    expect(MailboxRoute).toHaveBeenCalledWith('5', null);
  });

  it('should linkTo index from mailbox', function () {
    Router.linkTo('index');

    // index route called once
    expect(IndexRoute).toHaveBeenCalledWith(null);

    // mailbox route not called
    expect(MailboxRoute).not.toHaveBeenCalled();
  });

  it('should linkTo message from mailbox', function () {
    Router.linkTo('message', {
      mailboxId: 5,
      messageId: 2
    });

    // index route called once
    expect(IndexRoute).not.toHaveBeenCalled();

    // mailbox route not called
    expect(MailboxRoute).toHaveBeenCalledWith('5', '2', null);
  });

  it('should linkTo mailbox from message', function () {
    Router.linkTo('mailbox', {mailboxId: 5});

    // index route called once
    expect(IndexRoute).not.toHaveBeenCalled();

    // mailbox route not called
    expect(MailboxRoute).toHaveBeenCalledWith('5', null);
  });
});
