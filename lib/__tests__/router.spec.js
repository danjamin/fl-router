/* global describe, it, before, afterEach */

import expect from 'expect.js';
import sinon from 'sinon';

import Router from '../router.js';
import RouteStore from '../stores/RouteStore.js';

describe('Router', function () {
  var routes,
    ResetRoute,
    IndexRoute,
    MailboxRoute,
    started = false;

  before(function () {
    ResetRoute = sinon.spy();
    IndexRoute = sinon.spy();
    MailboxRoute = sinon.spy();

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

    ResetRoute.reset();
    IndexRoute.reset();
    MailboxRoute.reset();
  });

  it('has the right properties', function () {
    expect(Router).to.be.ok();
    expect(Router.start).to.be.a('function');
    expect(Router.getURLFromRoute).to.be.a('function');
    expect(Router.linkTo).to.be.a('function');
    expect(Router.linkToURL).to.be.a('function');
    expect(Router.transitionTo).to.be.a('function');
    expect(Router.beforeEach).to.be.a('function');
    expect(Router.afterEach).to.be.a('function');
    expect(Router.clearEach).to.be.a('function');
  });

  it('should initially invoke the index route', function () {
    Router.start(routes);
    started = true;

    // index route called once
    expect(IndexRoute.calledOnce).to.be(true);

    // mailbox route not called
    expect(MailboxRoute.called).to.be(false);
  });

  it('should NOT linkTo reset when there already', function () {
    Router.linkTo('reset');

    expect(ResetRoute.called).to.be(false);
    expect(IndexRoute.called).to.be(false);
    expect(MailboxRoute.called).to.be(false);
  });

  it('should linkTo mailbox from index', function () {
    Router.linkTo('mailbox', [5]);

    expect(IndexRoute.called).to.be(false);
    expect(MailboxRoute.calledWithExactly('5')).to.be(true);
  });

  it('should linkTo index from mailbox', function () {
    Router.linkTo('index');

    expect(IndexRoute.calledWithExactly()).to.be(true);
    expect(MailboxRoute.called).to.be(false);
  });

  it('should linkTo message from mailbox', function () {
    Router.linkTo('message', [5, 2]);

    expect(IndexRoute.called).to.be(false);
    expect(MailboxRoute.calledWithExactly('5', '2')).to.be(true);
  });

  it('should linkTo mailbox from message', function () {
    Router.linkTo('mailbox', [5]);

    expect(IndexRoute.called).to.be(false);
    expect(MailboxRoute.calledWithExactly('5')).to.be(true);
  });

  it('should transitionTo mailbox', function () {
    Router.transitionTo('mailbox', [5]);

    expect(ResetRoute.called).to.be(false);
    expect(IndexRoute.called).to.be(false);
    expect(MailboxRoute.called).to.be(false);
    expect(RouteStore.getRouteName()).to.be('mailbox');
    expect(RouteStore.getRouteParams()[0]).to.be(5); // todo: consistent with linkTo?
    expect(RouteStore.getRouteParams().length).to.be(1);
    expect(RouteStore.getURL()).to.be('#box/5');
  });

  it('should call beforeEach', function () {
    var spy = sinon.spy();
    Router.beforeEach(spy);

    Router.linkTo('index');

    expect(IndexRoute.calledOnce).to.be(true);
    expect(spy.calledWithExactly('index', [])).to.be(true);
  });

  it('should call afterEach', function () {
    var spy = sinon.spy();
    Router.afterEach(spy);

    Router.linkTo('mailbox', [1]);

    expect(MailboxRoute.calledOnce).to.be(true);
    expect(spy.calledWithExactly('mailbox', ['1'])).to.be(true);
    expect(RouteStore.getRouteName()).to.be('mailbox');
    expect(RouteStore.getRouteParams()[0]).to.be('1');
    expect(RouteStore.getRouteParams().length).to.be(1);
    expect(RouteStore.getURL()).to.be('#box/1');
  });

  it('should call multiple beforeEach and afterEach', function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var spy3 = sinon.spy();

    Router.beforeEach(spy1);
    Router.beforeEach(spy2);
    Router.afterEach(spy2);
    Router.afterEach(spy3);

    Router.linkTo('index');

    expect(IndexRoute.calledOnce).to.be(true);

    expect(spy1.calledWithExactly('index', [])).to.be(true);
    expect(spy2.calledWithExactly('index', [])).to.be(true);
    expect(spy3.calledWithExactly('index', [])).to.be(true);

    expect(spy1.calledOnce).to.be(true);
    expect(spy2.calledTwice).to.be(true);
    expect(spy3.calledOnce).to.be(true);
  });
});
