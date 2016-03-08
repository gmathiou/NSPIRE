var map = angular.module('map', ['ionic', 'ngCordova', '500px.service'])

map.controller('MapController', [
    '$rootScope',
    '$scope',
    'HomeService',
    'FiveHundredService',
    '$cordovaGeolocation',
    '$ionicLoading',
    '$timeout',
    '$ionicPlatform',
    '$ionicModal',
    '$ionicScrollDelegate',
    function($rootScope, $scope, HomeService, FiveHundredService, $cordovaGeolocation, $ionicLoading, $timeout, $ionicPlatform, $ionicModal, $ionicScrollDelegate) {

        $scope.markers = [];

        $scope.initMap = function() {
            HomeService.getLocation().then(function(position) {
                console.log(position);
                $scope.map = {
                    center: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    zoom: 12,
                    options: {}
                };
                $scope.loadPhotos();
            }, function(error) {
                console.error("Geolocation failed");
                $scope.initMap();
            });
        };

        $scope.loadPhotos = function() {
            if (HomeService.photos.length > 0) {
                $scope.photos = HomeService.photos;
                $scope.initMarkers($scope.photos);
            } else {
                HomeService.loadPhotos().then(function(photos) {
                    $scope.photos = photos;
                    $scope.initMarkers($scope.photos);
                });
            }
        };

        $scope.initMarkers = function(photos) {
            for (var i = 0; i < photos.length; i++) {
                var marker = {
                    id: photos[i].id,
                    coords: {
                        latitude: photos[i].latitude,
                        longitude: photos[i].longitude
                    },
                    options: { draggable: false },
                };
                $scope.markers.push(marker);
            }
        };

        $scope.initMap();
    }]);