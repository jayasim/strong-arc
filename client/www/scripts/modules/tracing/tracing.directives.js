Tracing.directive('slTracingTimeSeriesChart', [
  '$log',
  'TimeSeries',
  function($log, TimeSeries) {
    return {
      scope: {
        chartName: '@',
        currentTimeline: '='
      },
      restrict: 'E',
      templateUrl: './scripts/modules/tracing/templates/tracing.time-series.viz.html',
      link: function(scope, el, attrs) {
        var colormap = {
          'Process Heap Total': 'rgba(63,182,24, 1)',
          'Process Heap Used': 'rgba(255,117,24, 1)',
          'Process RSS': 'rgba(39,128,227, 1)',
          'Load Average': 'rgba(39,128,227, 1)',
          'Uptime': 'rgba(255,117,24, 1)'
        };

        function color(name){
          return colormap[name] || '#00000'
        }

        scope.cpuGraphOptions = {
          color: color,
          format: {
            'y': 'num',
            'y1': 's'
          },
          keySchema: {
            'Load Average': {
              class: 'cx-monitor-loadavg',
              type: 'line',
              y: 'y'
            },
            'Uptime': {
              class: 'cx-monitor-uptime',
              type: 'line',
              y: 'y1'
            }
          }
        };
        scope.memGraphOptions = {
          yMin: 0,
          color: color,
          formatter: {}
        };
        $log.debug('Chart Name:  ' + scope.chartName);

        scope.cpugraph = TimeSeries('#cpu-history-cont', scope.cpuGraphOptions);
        scope.memgraph = TimeSeries('#memory-history-cont', scope.memGraphOptions);
        scope.$watch('currentTimeline', function(timeline, oldVal) {
          if( timeline.cpu){
            scope.cpugraph.draw(timeline.cpu);
          }
          if( timeline.mem){
            scope.memgraph.draw(timeline.mem);
          }
          //if((scope.chartName === 'mem') && timeline.mem){
          //  scope.memgraph.draw(timeline.mem);
          //}
        }, true);
      }

    }
  }
]);
Tracing.directive('slTracingTransactionHistory', [
  '$log',
  'TransactionList',
  function($log, TransactionList) {
    return {
      templateUrl: './scripts/modules/tracing/templates/tracing.transaction.history.html',
      restrict: 'E',
      link: function(scope, el, attrs) {


        scope.transactionListView = TransactionList('[data-hook="transaction-list-cont"]', {});

        scope.$watch('transactionKeys', function(newVal, oldVal) {
          if (newVal.length) {
            scope.transactionListView.render(newVal, scope.currentHost);
          }

        });
      }
    }
  }

]);
