var TracingViz = angular.module('TracingViz', [])
  .value('TimeSeries', require('cxviz-timeseries'))
  .value('TransactionList', require('./transaction-list'));
