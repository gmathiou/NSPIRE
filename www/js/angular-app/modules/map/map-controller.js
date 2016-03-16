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
        $scope.photos = [];
        $scope.data = {};
        $scope.map = {};
        $scope.map.markers = [];

        $scope.$watch('data.slider', function(nv, ov) {
            if (!nv) {
                return;
            }
            $scope.slider = $scope.data.slider;
            $scope.slider.on('slideChangeEnd', $scope.slideChanged);
        });

        $scope.slideChanged = function(slider) {
            var photo = $scope.photos[slider.activeIndex];
            $scope.map.center = {
                latitude: photo.latitude,
                longitude: photo.longitude
            };
            $scope.lightUpMarker(photo);
            $scope.$apply();
        };

        $scope.lightUpMarker = function(photo) {
            $scope.map.markers = [];
            for (var i = 0; i < $scope.photos.length; i++) {
                var marker = {
                    uid: $scope.photos[i].id,
                    latitude: $scope.photos[i].latitude,
                    longitude: $scope.photos[i].longitude,
                    photo: $scope.photos[i],
                    index: i,
                    icon: $scope.photos[i].id == photo.id ? "img/big-marker-active.png" : "img/big-marker.png"
                };
                $scope.map.markers.push(marker);
            }
        };

        $scope.initMap = function() {
            $ionicLoading.show();
            HomeService.getLocation().then(function(position) {
                console.log(position);
                $scope.map = {
                    center: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    },
                    pan: true,
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
                $scope.map.control = {};
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
            $ionicLoading.hide();
        };

        $scope.initMarkers = function(photos) {
            $scope.map.markers = [];
            for (var i = 0; i < photos.length; i++) {
                var marker = {
                    uid: photos[i].id,
                    latitude: photos[i].latitude,
                    longitude: photos[i].longitude,
                    photo: photos[i],
                    index: i,
                    icon: i == 0 ? "img/big-marker-active.png" : "img/big-marker.png"
                };
                $scope.map.markers.push(marker);
                if (i == 0) {
                    $scope.map.center = {
                        latitude: photos[i].latitude,
                        longitude: photos[i].longitude
                    };
                }
            };
            $ionicSlideBoxDelegate.update();
        };

        $scope.markerTouched = function(marker, event, instance) {
            $scope.slider.slideTo(instance.index);
            $scope.map.center = {
                latitude: instance.photo.latitude,
                longitude: instance.photo.longitude
            };
            $scope.$apply();
        };

        $scope.distance = function(lat, lon) {
            var distance = AppService.getDistanceFromLatLonInKm(lat, lon, HomeService.myPosition.coords.latitude, HomeService.myPosition.coords.longitude);
            return distance;
        };

        $rootScope.$on('tabChanged', function(event, tabIndex) {
            if (tabIndex == 2) {
                $scope.initMap();
            }
        });

        $scope.initMap();
    }]);