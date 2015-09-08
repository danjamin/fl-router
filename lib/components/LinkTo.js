import React from 'react';
import Router from '../router.js';

export default React.createClass({
  displayName: 'LinkTo',

  propTypes: {
    // required
    route: React.PropTypes.string.isRequired,

    // optionally add params
    params: React.PropTypes.array,

    // optionally set isActive (supercedes activeURL checking)
    isActive: React.PropTypes.bool,

    // optionally check for active against the activeURL
    activeURL: React.PropTypes.string,

    // match substring
    matchPartial: React.PropTypes.bool,

    // optionally add class name string
    className: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      params: [],
      isActive: null,
      activeURL: null,
      matchPartial: true,
      className: ''
    };
  },

  render: function () {
    /*jshint scripturl:true*/

    var extraProps = {};
    var url = Router.getURLFromRoute(this.props.route, this.props.params);
    var classes = this.props.className ? this.props.className : '';
    var isActive = false;

    if (this.props.isActive !== null) {
      isActive = this.props.isActive;
    } else if (this.props.activeURL !== null) {
      isActive = Router.isMatch(url, this.props.activeURL, this.props.matchPartial);
    }

    if (isActive) {
      classes += ' active';
      url = 'javascript:;';
      extraProps.rel = 'nofollow';
    }

    return (
      <a href={url} className={classes}
          onClick={this.handleClick.bind(this, isActive, url)}
          {...extraProps}>
        {this.props.children}
      </a>
    );
  },

  handleClick: function (isActive, url, e) {
    e.preventDefault();

    if (isActive) {
      return;
    }

    Router.linkToURL(url);
  }
});
