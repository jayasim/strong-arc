var given = {};

given.emptyWorkspace = function() {
  return inject(function($http, $rootScope, $q, throwHttpError) {
    function reset() {
      return $http({
        method: 'POST',
        url: '/reset'
      }).catch(throwHttpError);
    }

    // NOTE(bajtos) When a new app instance is created before each test,
    // the app loads the project name from package.json.
    // We have to wait for that request to finish to prevent console warnings

    if ($rootScope.projectName) {
      // `app.run()` has already finished
      return reset();
    }

    // wait for `app.run()` to finish
    var deferred = $q.defer();
    var resolved = false;
    $rootScope.$watch('projectName', function() {
      if (resolved) return;
      resolved = true;
      reset().then(
        function(res) {
          deferred.resolve(res);
        },
        function(err) {
          deferred.reject(err);
        });
    });

    return deferred.promise;
  });
};

var _givenValueCounter = 0;

given.modelDefinition = function(data) {
  return inject(function(ModelDefinition) {
    data = angular.extend({
      name: 'aModelDefinition_' + (++_givenValueCounter),
      facetName: 'common',
    }, data);
    return new ModelDefinition(data);
  });
};

given.dataSourceDefinition = function(data) {
  return inject(function(DataSourceDefinition) {
    data = angular.extend({
      name: 'aDataSourceDefinition' + (++_givenValueCounter),
      facetName: 'server',
      connector: 'memory',
    }, data);
    return new DataSourceDefinition(data);
  });
};
