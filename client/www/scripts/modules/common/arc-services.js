(function(window, angular, undefined) {'use strict';

var urlBase = "/api";
var authHeader = 'authorization';

/**
 * @ngdoc overview
 * @name ArcServices
 * @module
 * @description
 *
 * The `ArcServices` module provides services for interacting with
 * the models exposed by the LoopBack server via the REST API.
 *
 */
var module = angular.module("ArcServices", ['ngResource']);

/**
 * @ngdoc object
 * @name ArcServices.Project
 * @header ArcServices.Project
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Project` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Project",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Projects/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name ArcServices.Project#current
         * @methodOf ArcServices.Project
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         * This method does not accept any data. Supply an empty object.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * <em>
         * (The remote method definition does not provide any description.
         * This usually means the response is a `Project` object.)
         * </em>
         */
        "current": {
          url: urlBase + "/Projects/current",
          method: "POST"
        },
      }
    );




    /**
    * @ngdoc property
    * @name ArcServices.Project#modelName
    * @propertyOf ArcServices.Project
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Project`.
    */
    R.modelName = "Project";


    return R;
  }]);

/**
 * @ngdoc object
 * @name ArcServices.Trace
 * @header ArcServices.Trace
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `Trace` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "Trace",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/Traces/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name ArcServices.Trace#fetchTrace
         * @methodOf ArcServices.Trace
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `msg` – `{string=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `data` – `{string=}` - 
         */
        "fetchTrace": {
          url: urlBase + "/Traces/fetchTrace",
          method: "POST"
        },
      }
    );




    /**
    * @ngdoc property
    * @name ArcServices.Trace#modelName
    * @propertyOf ArcServices.Trace
    * @description
    * The name of the model represented by this $resource,
    * i.e. `Trace`.
    */
    R.modelName = "Trace";


    return R;
  }]);

/**
 * @ngdoc object
 * @name ArcServices.TraceHost
 * @header ArcServices.TraceHost
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `TraceHost` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "TraceHost",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/TraceHosts/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name ArcServices.TraceHost#fetchHosts
         * @methodOf ArcServices.TraceHost
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `msg` – `{string=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `data` – `{string=}` - 
         */
        "fetchHosts": {
          url: urlBase + "/TraceHosts/fetchHosts",
          method: "POST"
        },
      }
    );




    /**
    * @ngdoc property
    * @name ArcServices.TraceHost#modelName
    * @propertyOf ArcServices.TraceHost
    * @description
    * The name of the model represented by this $resource,
    * i.e. `TraceHost`.
    */
    R.modelName = "TraceHost";


    return R;
  }]);

/**
 * @ngdoc object
 * @name ArcServices.TraceTimeline
 * @header ArcServices.TraceTimeline
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `TraceTimeline` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "TraceTimeline",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/TraceTimelines/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name ArcServices.TraceTimeline#fetchTimeLine
         * @methodOf ArcServices.TraceTimeline
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `msg` – `{string=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `data` – `{string=}` - 
         */
        "fetchTimeLine": {
          url: urlBase + "/TraceTimelines/fetchTimeLine",
          method: "POST"
        },
      }
    );




    /**
    * @ngdoc property
    * @name ArcServices.TraceTimeline#modelName
    * @propertyOf ArcServices.TraceTimeline
    * @description
    * The name of the model represented by this $resource,
    * i.e. `TraceTimeline`.
    */
    R.modelName = "TraceTimeline";


    return R;
  }]);

/**
 * @ngdoc object
 * @name ArcServices.TraceWaterfall
 * @header ArcServices.TraceWaterfall
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `TraceWaterfall` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "TraceWaterfall",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/TraceWaterfalls/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name ArcServices.TraceWaterfall#transactionKeys
         * @methodOf ArcServices.TraceWaterfall
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `msg` – `{string=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `data` – `{string=}` - 
         */
        "transactionKeys": {
          url: urlBase + "/TraceWaterfalls/transactionKeys",
          method: "POST"
        },
      }
    );




    /**
    * @ngdoc property
    * @name ArcServices.TraceWaterfall#modelName
    * @propertyOf ArcServices.TraceWaterfall
    * @description
    * The name of the model represented by this $resource,
    * i.e. `TraceWaterfall`.
    */
    R.modelName = "TraceWaterfall";


    return R;
  }]);

/**
 * @ngdoc object
 * @name ArcServices.TraceTransactionKey
 * @header ArcServices.TraceTransactionKey
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `TraceTransactionKey` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "TraceTransactionKey",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/TraceTransactionKeys/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name ArcServices.TraceTransactionKey#transactionKeys
         * @methodOf ArcServices.TraceTransactionKey
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `msg` – `{string=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `data` – `{string=}` - 
         */
        "transactionKeys": {
          url: urlBase + "/TraceTransactionKeys/transactionKeys",
          method: "POST"
        },
      }
    );




    /**
    * @ngdoc property
    * @name ArcServices.TraceTransactionKey#modelName
    * @propertyOf ArcServices.TraceTransactionKey
    * @description
    * The name of the model represented by this $resource,
    * i.e. `TraceTransactionKey`.
    */
    R.modelName = "TraceTransactionKey";


    return R;
  }]);

/**
 * @ngdoc object
 * @name ArcServices.TraceTransactionHistory
 * @header ArcServices.TraceTransactionHistory
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `TraceTransactionHistory` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "TraceTransactionHistory",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/TraceTransactionHistories/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name ArcServices.TraceTransactionHistory#transactionHistory
         * @methodOf ArcServices.TraceTransactionHistory
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {Object} postData Request data.
         *
         *  - `msg` – `{string=}` - 
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `data` – `{string=}` - 
         */
        "transactionHistory": {
          url: urlBase + "/TraceTransactionHistories/transactionHistory",
          method: "POST"
        },
      }
    );




    /**
    * @ngdoc property
    * @name ArcServices.TraceTransactionHistory#modelName
    * @propertyOf ArcServices.TraceTransactionHistory
    * @description
    * The name of the model represented by this $resource,
    * i.e. `TraceTransactionHistory`.
    */
    R.modelName = "TraceTransactionHistory";


    return R;
  }]);

/**
 * @ngdoc object
 * @name ArcServices.ArcApp
 * @header ArcServices.ArcApp
 * @object
 *
 * @description
 *
 * A $resource object for interacting with the `ArcApp` model.
 *
 * ## Example
 *
 * See
 * {@link http://docs.angularjs.org/api/ngResource.$resource#example $resource}
 * for an example of using this object.
 *
 */
module.factory(
  "ArcApp",
  ['LoopBackResource', 'LoopBackAuth', '$injector', function(Resource, LoopBackAuth, $injector) {
    var R = Resource(
      urlBase + "/ArcApps/:id",
      { 'id': '@id' },
      {

        /**
         * @ngdoc method
         * @name ArcServices.ArcApp#list
         * @methodOf ArcServices.ArcApp
         *
         * @description
         *
         * <em>
         * (The remote method definition does not provide any description.)
         * </em>
         *
         * @param {Object=} parameters Request parameters.
         *
         *   This method does not accept any parameters.
         *   Supply an empty object or omit this argument altogether.
         *
         * @param {function(Object,Object)=} successCb
         *   Success callback with two arguments: `value`, `responseHeaders`.
         *
         * @param {function(Object)=} errorCb Error callback with one argument:
         *   `httpResponse`.
         *
         * @returns {Object} An empty reference that will be
         *   populated with the actual data once the response is returned
         *   from the server.
         *
         * Data properties:
         *
         *  - `results` – `{ArcApp=}` - 
         */
        "list": {
          url: urlBase + "/ArcApps",
          method: "GET"
        },
      }
    );




    /**
    * @ngdoc property
    * @name ArcServices.ArcApp#modelName
    * @propertyOf ArcServices.ArcApp
    * @description
    * The name of the model represented by this $resource,
    * i.e. `ArcApp`.
    */
    R.modelName = "ArcApp";


    return R;
  }]);


module
  .factory('LoopBackAuth', function() {
    var props = ['accessTokenId', 'currentUserId'];
    var propsPrefix = '$LoopBack$';

    function LoopBackAuth() {
      var self = this;
      props.forEach(function(name) {
        self[name] = load(name);
      });
      this.rememberMe = undefined;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.save = function() {
      var self = this;
      var storage = this.rememberMe ? localStorage : sessionStorage;
      props.forEach(function(name) {
        save(storage, name, self[name]);
      });
    };

    LoopBackAuth.prototype.setUser = function(accessTokenId, userId, userData) {
      this.accessTokenId = accessTokenId;
      this.currentUserId = userId;
      this.currentUserData = userData;
    }

    LoopBackAuth.prototype.clearUser = function() {
      this.accessTokenId = null;
      this.currentUserId = null;
      this.currentUserData = null;
    }

    LoopBackAuth.prototype.clearStorage = function() {
      props.forEach(function(name) {
        save(sessionStorage, name, null);
        save(localStorage, name, null);
      });
    };

    return new LoopBackAuth();

    // Note: LocalStorage converts the value to string
    // We are using empty string as a marker for null/undefined values.
    function save(storage, name, value) {
      var key = propsPrefix + name;
      if (value == null) value = '';
      storage[key] = value;
    }

    function load(name) {
      var key = propsPrefix + name;
      return localStorage[key] || sessionStorage[key] || null;
    }
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('LoopBackAuthRequestInterceptor');
  }])
  .factory('LoopBackAuthRequestInterceptor', [ '$q', 'LoopBackAuth',
    function($q, LoopBackAuth) {
      return {
        'request': function(config) {

          // filter out non urlBase requests
          if (config.url.substr(0, urlBase.length) !== urlBase) {
            return config;
          }

          if (LoopBackAuth.accessTokenId) {
            config.headers[authHeader] = LoopBackAuth.accessTokenId;
          } else if (config.__isGetCurrentUser__) {
            // Return a stub 401 error for User.getCurrent() when
            // there is no user logged in
            var res = {
              body: { error: { status: 401 } },
              status: 401,
              config: config,
              headers: function() { return undefined; }
            };
            return $q.reject(res);
          }
          return config || $q.when(config);
        }
      }
    }])

  /**
   * @ngdoc object
   * @name ArcServices.LoopBackResourceProvider
   * @header ArcServices.LoopBackResourceProvider
   * @description
   * Use `LoopBackResourceProvider` to change the global configuration
   * settings used by all models. Note that the provider is available
   * to Configuration Blocks only, see
   * {@link https://docs.angularjs.org/guide/module#module-loading-dependencies Module Loading & Dependencies}
   * for more details.
   *
   * ## Example
   *
   * ```js
   * angular.module('app')
   *  .config(function(LoopBackResourceProvider) {
   *     LoopBackResourceProvider.setAuthHeader('X-Access-Token');
   *  });
   * ```
   */
  .provider('LoopBackResource', function LoopBackResourceProvider() {
    /**
     * @ngdoc method
     * @name ArcServices.LoopBackResourceProvider#setAuthHeader
     * @methodOf ArcServices.LoopBackResourceProvider
     * @param {string} header The header name to use, e.g. `X-Access-Token`
     * @description
     * Configure the REST transport to use a different header for sending
     * the authentication token. It is sent in the `Authorization` header
     * by default.
     */
    this.setAuthHeader = function(header) {
      authHeader = header;
    };

    /**
     * @ngdoc method
     * @name ArcServices.LoopBackResourceProvider#setUrlBase
     * @methodOf ArcServices.LoopBackResourceProvider
     * @param {string} url The URL to use, e.g. `/api` or `//example.com/api`.
     * @description
     * Change the URL of the REST API server. By default, the URL provided
     * to the code generator (`lb-ng` or `grunt-loopback-sdk-angular`) is used.
     */
    this.setUrlBase = function(url) {
      urlBase = url;
    };

    this.$get = ['$resource', function($resource) {
      return function(url, params, actions) {
        var resource = $resource(url, params, actions);

        // Angular always calls POST on $save()
        // This hack is based on
        // http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
        resource.prototype.$save = function(success, error) {
          // Fortunately, LoopBack provides a convenient `upsert` method
          // that exactly fits our needs.
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result;
        };
        return resource;
      };
    }];
  });

})(window, window.angular);
