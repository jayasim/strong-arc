Tracing.controller('TracingMainController', [
  '$scope',
  '$log',
  'TracingServices',
  'TimeSeries',
  function($scope, $log, TracingServices, TimeSeries) {
    $log.debug('tracing controller');
    $scope.currentHost = {};
    $scope.currentTimeline = {};



    //TimeSeries({}, {});

    $scope.hosts = TracingServices.fetchHosts()
      .then(function(response) {
        $log.debug('yay hosts: ' + JSON.stringify(response));

        $scope.hosts = response;
        $scope.currentHost = TracingServices.getCurrentHost();
        $scope.currentTimeline = TracingServices.fetchTimeline()
          .then(function(timelineRaw) {
            var tHost = timelineRaw.hosts['Seans-Air-2.telus'];
            var dataArray = tHost[9403];
            if (dataArray) {
              $scope.currentTimeline = TracingServices.convertTimeseries(dataArray)

            }
           // $log.debug('timeline: ' + JSON.stringify(timeline));
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
