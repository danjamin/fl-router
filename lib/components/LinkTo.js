import React from 'react';
import Router from '../router.js';

export default React.createClass({
  displayName: 'LinkTo',

  propTypes: {
    // required
    route: React.PropTypes.string.isRequired,

    // optionally add params
    params: React.PropTypes.array,

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
    var isActive = this.props.activeURL !== null &&
        Router.isMatch(url, this.props.activeURL, this.props.matchPartial);

    if (isActive) {
      classes += ' active';
      url = 'javascript:;';
      extraProps.rel = 'nofollow';
    }

    return (
      <a href={url} className={classes} {...extraProps}>
        {this.props.children}
      </a>
    );
  }
});
