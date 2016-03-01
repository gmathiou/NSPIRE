var home = angular.module('home', ['ionic', 'ngCordova', '500px.service'])

home.controller('HomeController', ['$rootScope', '$scope', 'FiveHundredService', '$cordovaGeolocation', '$ionicLoading', '$timeout', '$ionicPlatform', '$ionicModal', function ($rootScope, $scope, FiveHundredService, $cordovaGeolocation, $ionicLoading, $timeout, $ionicPlatform, $ionicModal) {
    var posOptions = { timeout: 10000, enableHighAccuracy: true };
    $scope.status = {};
    $scope.status.currentPage = 1;
    $scope.status.firstLoadCompleted = false;

    $ionicPlatform.ready(function () {
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                $rootScope.coords = { lat: position.coords.latitude, lon: position.coords.longitude };
                $scope.loadPhotos();
                $timeout(function () {
                    $scope.status.firstLoadCompleted = true;
                }, 4000);
            }, function (err) {
                // error
            });
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

    $scope.loadPhotos = function () {
        FiveHundredService.getPhotos($rootScope.coords, 30, $scope.status.currentPage).then(function (data) {
            if ($scope.status.currentPage > 1) {
                $scope.photos = $scope.photos.concat(data);
            } else {
                $scope.photos = data;
            }
            $scope.hide();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.doRefresh = function () {
	       $scope.loadPhotos();
    };

    $scope.distance = function (lat, lon) {
        var distance = getDistanceFromLatLonInKm(lat, lon, $rootScope.coords.lat, $rootScope.coords.lon);
        return distance;
    };

    $scope.loadMoreData = function () {
        if (!$rootScope.coords) {
            return;
        }
        $scope.status.currentPage = $scope.status.currentPage + 1;
        $scope.loadPhotos();
    };

    $scope.show();

    /** Distance in km */
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    $ionicModal.fromTemplateUrl('js/angular-app/modules/modals/filters.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function () {
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };


}]);