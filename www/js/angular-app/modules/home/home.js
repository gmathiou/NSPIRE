var home = angular.module('home', ['ionic', 'ngCordova', '500px.service'])

home.controller('HomeController', ['$rootScope', '$scope', 'FiveHundredService', '$cordovaGeolocation', '$ionicLoading', function ($rootScope, $scope, FiveHundredService, $cordovaGeolocation, $ionicLoading) {
    var posOptions = { timeout: 10000, enableHighAccuracy: true };

    $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
            $rootScope.coords = { lat: position.coords.latitude, lon: position.coords.longitude };
            console.log($rootScope.coords);
            FiveHundredService.getPhotos($rootScope.coords, 1).then(function (data) {
                $scope.photos = data;
                $scope.hide();
            });
        }, function (err) {
            // error
        });

    $scope.show = function () {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>',
            noBackdrop: true
        });
    };
    $scope.hide = function () {
        $ionicLoading.hide();
    };

    $scope.show();
}]);