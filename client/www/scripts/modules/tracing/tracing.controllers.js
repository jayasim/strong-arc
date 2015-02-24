Tracing.controller('TracingMainController', [
  '$scope',
  '$log',
  'TracingServices',
  function($scope, $log, TracingServices) {
    $log.debug('tracing controller');
    $scope.currentHost = {};
    $scope.currentTimeline = {};



    $scope.hosts = TracingServices.fetchHosts()
      .then(function(response) {
        $log.debug('yay hosts: ' + JSON.stringify(response));

        $scope.hosts = response;
        $scope.currentHost = TracingServices.getCurrentHost();
        $scope.currentTimeline = TracingServices.fetchTimeline()
          .then(function(timeline) {
            $scope.currentTimeline = timeline;
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
