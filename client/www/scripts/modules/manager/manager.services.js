Manager.service('ManagerServices', [
  '$log',
  function( $log) {
    var svc = this;

    /*
    *
    * Get Manager Hosts
    *
    * */
    svc.getHostServers = function() {
      var servers = JSON.parse(window.localStorage.getItem('hostServers'));
      if (servers) {
        return servers;
      }
      return [];

    };
    function ArrNoDupe(a) {
      var temp = {};
      for (var i = 0; i < a.length; i++)
        temp[a[i]] = true;
      var r = [];
      for (var k in temp)
        r.push(k);
      return r;
    }

    /*
     *
     * Update type-ahead db
     *
     * - one off
     *
     * */
    svc.addTypeAheadServer = function(config) {
      var existingServers = svc.getHostServers();
      if (existingServers.length > 0) {
        var bExists = false;
        existingServers.map(function(exSrv) {
          if (config.host === exSrv.host) {
            bExists = true;
          }
        });
        if (!bExists) {
          // add this one to the localStorage
          svc.addToHostServers(config);
        }
      }
    };
    /*
     *
     * Update type-ahead db
     *
     * - bulk
     *
     * */
    svc.updateHostServers = function(collection) {
      var existingServers = svc.getHostServers();
      if (existingServers.length > 0) {
        existingServers.map(function(exSrv) {
          var bExists = false;
          collection.map(function(cItem) {
            if (cItem.host === exSrv.host) {
              bExists = true;
            }
          });
          if (!bExists) {
            // add this one to the localStorage
            svc.addToHostServers(exSrv);
          }
        });
      }
      else {
        // fresh populate
       // existingServers = ArrNoDupe(collection);
        collection.map(function(cItem) {
          //if (existingServers.length === 0) {
          //  existingServers.push(cItem);
          //}
          //else {
          //  // there are values so make sure this one is unique
          //}
          // iterate over list
          // only add unique values
          svc.addToHostServers(cItem);
        });
      }


    };
    /*
    *
    * Append server config to localStorage
    *
    * */
    svc.addToHostServers = function(server) {
      var servers = svc.getHostServers();
      servers.push(server);
      window.localStorage.setItem('hostServers', JSON.stringify(servers));
    };

    return svc;
  }
]);
