Tracing.controller('TracingMainController', [
  '$scope',
  '$log',
  'TracingServices',
  'TimeSeries',
  function($scope, $log, TracingServices, TimeSeries) {
    $log.debug('tracing controller');
    $scope.currentTimeline = {};
    $scope.transactionKeys = [];
    $scope.currentProject = 'wfp:helloworld';
    //$scope.currentHost = {
    //  host = ctx.state.params.host
    //  pid = ctx.state.params.pid
    //}





    $scope.hosts = TracingServices.fetchHosts()
      .then(function(response) {
        $log.debug('yay hosts: ' + JSON.stringify(response));

        $scope.hosts = response;
        var firstHost = TracingServices.getFirstHost();
        $scope.currentHost = {
          project: 'wfp:helloworld',
          host:firstHost.host,
          pid:firstHost.pids[0]
        };
        $scope.currentTimeline = TracingServices.fetchTimeline({reqparams:$scope.currentHost})
          .then(function(timelineRaw) {
            var tHost = timelineRaw.hosts['Seans-Air-2.telus'];
            var dataArray = tHost[9403];
            if (dataArray) {
              $scope.currentTimeline = TracingServices.convertTimeseries(dataArray)

            }
          });

        $scope.transactionKeys = TracingServices.transactionKeys({reqparams:$scope.currentHost})
          .then(function(response) {

            if (response.hosts) {
              var transactionKCollection = response.hosts[$scope.currentHost.host] ? response.hosts[$scope.currentHost.host][$scope.currentHost.pid] : [];
              transactionKCollection.map(function(transaction) {
                TracingServices.transactionHistory(encodeURIComponent(transaction), $scope.currentHost.host, $scope.currentHost.pid)
                  .then(function(response){
                    transactionKCollection.transactionHistory = response.data;
                    $log.debug('Assign transactionData');
                    //$log.debug('transdata: ' + response.data);
                    //self.renderItem(key, history.hosts[host][pid])
                  });
              });







              $scope.transactionKeys = response.hosts[$scope.currentHost.host] ? response.hosts[$scope.currentHost.host][$scope.currentHost.pid] : []

            }

          });
      })
      .catch(function(error) {
        $log.warn('error: ' + error.message);
      });


  }
]);
Tracing.controller('TracingMonitorController', [
  '$scope',
  '$log',
  function($scope, $log) {

  }
]);
