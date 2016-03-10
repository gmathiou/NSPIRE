var map = angular.module('map', ['ionic', 'ngCordova', '500px.service', 'common.services'])

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
    '$ionicSlideBoxDelegate',
    'AppService',
    function($rootScope, $scope, HomeService, FiveHundredService, $cordovaGeolocation, $ionicLoading, $timeout, $ionicPlatform, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate, AppService) {

        $scope.markers = [];

        $scope.data = {};
        $scope.$watch('data.slider', function(nv, ov) {
            $scope.slider = $scope.data.slider;
        })

        $scope.initMap = function() {
            $ionicLoading.show();
            HomeService.getLocation().then(function(position) {
                console.log(position);
                $scope.map = {
                    center: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    zoom: 12,
                    options: {
                        mapTypeControl: false,
                        panControl: false,
                        scaleControl: false,
                        scrollwheel: false,
                        streetViewControl: false,
                        zoomControl: false
                    }
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
            // $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
        };

        $scope.initMarkers = function(photos) {
            for (var i = 0; i < photos.length; i++) {
                var marker = {
                    uid: photos[i].id,
                    latitude: photos[i].latitude,
                    longitude: photos[i].longitude,
                    image: "img/marker.png"
                };
                $scope.markers.push(marker);
            };
            $ionicSlideBoxDelegate.update();
        };

        $scope.distance = function(lat, lon) {
            var distance = AppService.getDistanceFromLatLonInKm(lat, lon, HomeService.myPosition.coords.latitude, HomeService.myPosition.coords.longitude);
            return distance;
        };

        $scope.initMap();
    }]);