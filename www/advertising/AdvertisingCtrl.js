angular.module('com.unarin.cordova.proximity.quickstart.advertising')
    .factory('logAlert', function () {
        return function logAlert(){
            alert(JSON.stringify(arguments));
        }
    })
    .controller('AdvertisingCtrl' ,['$log', '$scope', '$window', '$localForage', 'proximityManager', 'logAlert', function ($log, $scope, $window, $localForage, proximityManager, logAlert){

        function createBeacon(){
            var uuid = '0b5180b9-fd90-4e5a-9d32-b0bffba08745'; // mandatory
            var identifier = 'advertisedBeacon'; // mandatory
            var minor = 1000; // optional, defaults to wildcard if left empty
            var major = 5; // optional, defaults to wildcard if left empty

            // throws an error if the parameters are not valid
            var beaconRegion = new $window.cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);
            logAlert('beaconCreated: done()');
            return beaconRegion;
        }
        $scope.beacon = createBeacon();

        $scope.startAdvertising = function () {
            var delegate = $window.cordova.plugins.locationManager.getDelegate()
            // Event when advertising starts (there may be a short delay after the request)
            // The property 'region' provides details of the broadcasting Beacon
            delegate.peripheralManagerDidStartAdvertising = function(pluginResult) {
                console.log('peripheralManagerDidStartAdvertising: '+ JSON.stringify(pluginResult.region));
            };

            // Event when bluetooth transmission state changes
            // If 'state' is not set to BluetoothManagerStatePoweredOn when advertising cannot start
            delegate.peripheralManagerDidUpdateState = function(pluginResult) {
                console.log('peripheralManagerDidUpdateState: '+ pluginResult.state);
            };

            $window.cordova.plugins.locationManager.setDelegate(delegate);

            $window.cordova.plugins.locationManager.isAdvertisingAvailable()
                .then(function(isSupported){
                    if (isSupported) {
                        $window.cordova.plugins.locationManager.startAdvertising($scope.beacon)
                            .fail(function (e) {
                                logAlert(e);
                            })
                            .done(function (e) {
                                logAlert('startAdvertising:done()')
                            });
                    } else {
                        logAlert('Advertising not supported')
                    }
                })
                .fail(function(e) { logAlert('isAdvertisingAvailable:fail',e); })
                .done(function (e) {
                    logAlert('isAdvertisingAvailable:done()')
                });
        }

        $scope.stopAdvertising = function () {
            //Stopping the advertising (iOS only)
            $window.cordova.plugins.locationManager.stopAdvertising()
                .fail(function(e) { logAlert("StopAdvertising: fail()", e) })
                .done(function () {
                    logAlert("stopAdvertising: done()")
                });

        }
    }])