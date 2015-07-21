var ROUTE_PARAM_NAME_WHITELIST_CHARS = /[0-9a-zA-Z\_\-]/;
var ROUTE_PARAM_PREFIX = ':';
var ROUTE_PARAM_OPTIONAL_PREFIX = '(';
var ROUTE_PARAM_OPTIONAL_SUFFIX = ')';

/**
 * Resolves a URL from a given path string and params array
 * Handles optional params like 'mailbox(/:id)'
 * @param string path The path string (e.g. 'mailbox/:id')
 * @param array params The array of params to fill in one by one
 */
export default function (path, params) {
  var url,
    paramIndex;

  params = params ? params : [];

  url = '';
  paramIndex = 0;

  // replace each param in the path
  for (var i = 0, iMax = path.length; i < iMax;) {
    switch (path[i]) {
      case ROUTE_PARAM_PREFIX:
        // skip this char
        ++i;

        // if we have separator then try to replace the whole param
        while (i < iMax && ROUTE_PARAM_NAME_WHITELIST_CHARS.test(path[i])) {
          ++i;
        }

        if (paramIndex >= params.length) {
          throw 'Too few params were passed to the routeURLResolver';
        }

        url += params[paramIndex];
        ++paramIndex;
        break;

      case ROUTE_PARAM_OPTIONAL_PREFIX:
        // skip this char
        ++i;

        if (path[i] === '/' && paramIndex < params.length) {
          url += path[i];
          ++i;
        }

        // if we have a starting optional, check if we have params left
        // if no params left, then erase the optional completely
        // if there are params left, then replace optional with param
        while (i < iMax && ROUTE_PARAM_OPTIONAL_SUFFIX !== path[i]) {
          ++i;
        }

        if (paramIndex < params.length) {
          url += params[paramIndex];
          ++paramIndex;
        }
        ++i;
        break;

      default:
        url += path[i];
        ++i;
        break;
    }
  }

  if (paramIndex < params.length) {
    console.warn('Too many params were passed to the routeURLResolver');
  }

  return url;
}
