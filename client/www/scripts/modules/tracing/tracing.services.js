Tracing.service('TracingServices', [
  '$http',
  '$log',
  'TraceHost',
  'TraceTimeline',
  'TraceTransactionKey',
  'TraceTransactionHistory',
  function($http, $log, TraceHost, TraceTimeline, TraceTransactionKey, TraceTransactionHistory) {
    var svc = this;
    var currTraceHosts = [];

    'use strict';

    //var ajax = require('component-ajax')
   // var enhance = require('concurix-waterfalltransform').enhanceWaterfall


    function API(options) {
      var opts = options || {}
      this.base = opts.base || '/'
      this.project = opts.project || ''
      return this
    }

    svc.convertTimeseries = function(t){
      var ret = {};
      ret.mem = t.map(function(d){
        var item = {
          _t: moment(d.ts).unix()*1000,
          'Process Heap Total': d.p_mt,
          'Process Heap Used': d.p_mu,
          'Process RSS': d.p_mr,
          __data: d
        };
        return item;
      });
      ret.mem = ret.mem.sort(function(a,b){ return a._t - b._t;});

      ret.cpu = t.map(function(d){
        var item = {
          _t: moment(d.ts).unix()*1000,
          'Load Average': d['s_la'],
          'Uptime': d['p_ut'],
          __data: d
        };
        return item;
      });
      ret.cpu = ret.cpu.sort(function(a,b){ return a._t - b._t;});
      return ret;
    };

    svc.fetchTrace = function fetchTrace(pfkey, cb) {
      var url = this.base + path.join('get_raw_pieces', encodeURIComponent(pfkey))
      cb = cb || function(){}
      $http.get(url)
        .success(function(data, status, xhr) { cb(null, enhance(data)) })
        .error(function(xhr, status, err) { cb(err) });
    };

    svc.fetchHosts = function(cb) {

      return TraceHost.fetchHosts()
        .$promise
        .then(function(response) {
          if (JSON.parse(response.data).hosts) {
            currTraceHosts  = JSON.parse(response.data).hosts;
          }
          return currTraceHosts;
        })
        .catch(function(error) {
          $log.warn('error fetching hosts: ' + error.message);
        });
    };

    // get first index for prototype
    svc.getFirstHost = function() {
      return currTraceHosts[0];
    };

    svc.fetchTimeline = function(serverConfig) {

      return TraceTimeline.fetchTimeLine(serverConfig)
        .$promise
        .then(function(response) {
          return JSON.parse(response.data);
        })
        .catch(function(error) {
          $log.warn('error getting timeline: ' + error.message);
        });

    };

    svc.transactionKeys = function transactionKeys(reqparams){

      return TraceTransactionKey.transactionKeys(reqparams)
        .$promise
        .then(function(response) {
          return JSON.parse(response.data);
        })
        .catch(function(error) {
          $log.warn('error getting transactionKeys: ' + error.message);
        });
    };

    svc.transactionHistory = function transactionHistory(transaction, host, pid) {

      var reqparams = {
        project: 'wfp:helloworld',
        transaction: transaction,
        host: host,
        pid: pid
      };

      //var url = this.base + path.join('get_transaction', this.project, transaction, ('' + host || '0'), ('' + pid || '0'))

      return TraceTransactionHistory.transactionHistory({reqparams: reqparams})
        .$promise
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          $log.warn('bad get transaction history: ' + error.message);
        });
    };
    return svc;
  }
]);
Tracing.service('TracingFormat', [
  function() {
    var svc = this;

    svc.format = function(string) {
      return string;
    };

    svc.mb = function mb(val){
      return numeral(val).format('0.0 b')
    };

    svc.ms = function millisecond(ms){
      return prettyms(ms)
    };

    svc.s = function second(s){
      return prettyms(s*1000)
    };

    svc.num = function num(val){
      return numeral(val).format('0.0 a')
    };

    svc.truncate = function truncate(str, front, back, options) {
      var opts = options || (typeof back === 'object') ? back : {}
      var ret = ''
      if (!str || (str.length <= front + back)) return str
      ret += str.slice(0, front)
      ret += opts.seperator || '...'
      if (typeof back == 'number') ret += str.slice(-back)
      return ret
    };



    return svc;
  }

]);
