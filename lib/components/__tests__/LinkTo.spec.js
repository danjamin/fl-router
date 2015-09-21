/* global describe, it, before */

var React = require('react/addons');
var expect = require('expect.js');
var injectr = require('injectr');

var TestUtils = React.addons.TestUtils;

describe('LinkTo', function () {
  describe('#render', function () {

    describe('#inactive', function () {
      var LinkTo;
      before(function () {
        LinkTo = injectr('../LinkTo.js', {
          '../router.js': {
            getURLFromRoute: function () {
              return 'http://localhost/cool-route';
            },
            isMatch: function () {
              return false;
            }
          }
        });
      });

      it('works with only required params', function () {
        var linkTo = TestUtils.renderIntoDocument(
          <LinkTo route='cool-route' />
        );

        var a = linkTo.getDOMNode();

        expect(a.tagName).to.be('A');
        expect(a.className).not.to.contain('active');
        expect(a.href).to.be('http://localhost/cool-route');
        expect(a.rel).to.be('');
        expect(a.innerHTML).to.be('');
      });

      it('works with required params and children', function () {
        var linkTo = TestUtils.renderIntoDocument(
          <LinkTo route='cool-route' className='other'>
            <div>Hi</div>
          </LinkTo>
        );

        var a = linkTo.getDOMNode();

        expect(a.tagName).to.be('A');
        expect(a.className).not.to.contain('active');
        expect(a.className).to.contain('other');
        expect(a.href).to.be('http://localhost/cool-route');
        expect(a.rel).to.be('');
        expect(a.childNodes.length).to.be(1);

        var div = a.childNodes[0];
        expect(div.tagName).to.be('DIV');
        expect(div.innerHTML).to.be('Hi');
      });

      it('is inactive when isActive is false', function () {
        var linkTo = TestUtils.renderIntoDocument(
          <LinkTo route='cool-route' isActive={false} />
        );

        var a = linkTo.getDOMNode();

        expect(a.tagName).to.be('A');
        expect(a.className).not.to.contain('active');
        expect(a.href).to.be('http://localhost/cool-route');
        expect(a.rel).to.be('');
      });
    });

    describe('#active', function () {
      var LinkTo;
      before(function () {
        LinkTo = injectr('../LinkTo.js', {
          '../router.js': {
            getURLFromRoute: function () {
              return 'http://localhost/cool-route';
            },
            isMatch: function () {
              return true;
            }
          }
        });
      });

      it('is not active without activeURL provided', function () {
        var linkTo = TestUtils.renderIntoDocument(
          <LinkTo route='cool-route' />
        );

        var a = linkTo.getDOMNode();

        expect(a.tagName).to.be('A');
        expect(a.className).not.to.contain('active');
        expect(a.href).to.be('http://localhost/cool-route');
        expect(a.rel).to.be('');
      });

      it('is active when activeURL is provided', function () {
        /*jshint scripturl:true*/
        var linkTo = TestUtils.renderIntoDocument(
          <LinkTo route='cool-route' activeURL='http://localhost/cool-route' />
        );

        var a = linkTo.getDOMNode();

        expect(a.tagName).to.be('A');
        expect(a.className).to.contain('active');
        expect(a.href).to.be('javascript:;');
        expect(a.rel).to.be('nofollow');
      });

      it('is active when isActive is true', function () {
        /*jshint scripturl:true*/
        var linkTo = TestUtils.renderIntoDocument(
          <LinkTo route='cool-route' isActive={true} />
        );

        var a = linkTo.getDOMNode();

        expect(a.tagName).to.be('A');
        expect(a.className).to.contain('active');
        expect(a.href).to.be('javascript:;');
        expect(a.rel).to.be('nofollow');
      });

      it('is NOT active when isActive=false regardless of activeURL match', function () {
        /*jshint scripturl:true*/
        var linkTo = TestUtils.renderIntoDocument(
          <LinkTo route='cool-route' isActive={false}
              activeURL='http://localhost/cool-route' />
        );

        var a = linkTo.getDOMNode();

        expect(a.tagName).to.be('A');
        expect(a.className).not.to.contain('active');
        expect(a.href).to.be('http://localhost/cool-route');
        expect(a.rel).to.be('');
      });

      it('works with required params and children', function () {
        /*jshint scripturl:true*/
        var linkTo = TestUtils.renderIntoDocument(
          <LinkTo route='cool-route' className='other'
              activeURL='http://localhost/cool-route'
              matchPartial={true}>
            <div>Hi</div>
          </LinkTo>
        );

        var a = linkTo.getDOMNode();

        expect(a.tagName).to.be('A');
        expect(a.className).to.contain('other');
        expect(a.className).to.contain('active');
        expect(a.href).to.be('javascript:;');
        expect(a.rel).to.be('nofollow');
        expect(a.childNodes.length).to.be(1);

        var div = a.childNodes[0];
        expect(div.tagName).to.be('DIV');
        expect(div.innerHTML).to.be('Hi');
      });
    });

  });
});
