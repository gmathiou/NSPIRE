"use strict";

var photoSingle = angular.module('photo_single', ['ionic', 'ngCordova', '500px.service', 'uiGmapgoogle-maps'])

photoSingle.controller('PhotoSingleController', [
    '$rootScope',
    '$scope',
    'FiveHundredService',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicPlatform',
    '$ionicLoading',
    function ($rootScope, $scope, FiveHundredService, $cordovaGeolocation, $stateParams, $ionicPlatform, $ionicLoading) {
        $scope.photoId = $stateParams.photoid;
        $scope.photoItem = null;

        $scope.loadPhoto = function () {
            if ($scope.photoId) {
                $ionicLoading.show();
                FiveHundredService.getPhoto($scope.photoId).then(function (data) {
                    $scope.photoItem = data;
                    $ionicLoading.hide();
                    $scope.initMap();
                }, function (error) {

                });
            };
        };

        $scope.initMap = function () {
            $scope.map = {
                center: {
                    latitude: $scope.photoItem.photo.latitude,
                    longitude: $scope.photoItem.photo.longitude
                },
                zoom: 14,
                options: {
                    draggable: false,
                    mapTypeControl: false,
                    panControl: false,
                    scaleControl: false,
                    scrollwheel: false,
                    streetViewControl: false,
                    zoomControl: false
                }
            };

            $scope.marker = {
                id: 0,
                coords: {
                    latitude: $scope.photoItem.photo.latitude,
                    longitude: $scope.photoItem.photo.longitude
                },
                options: { draggable: false },
            };

            $scope.geocoder();
        };

        $scope.geocoder = function () {
            var geocoder = new google.maps.Geocoder;
            var latlng = { lat: parseFloat($scope.photoItem.photo.latitude), lng: parseFloat($scope.photoItem.photo.longitude) };
            geocoder.geocode({ 'location': latlng }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        $scope.marker.address = results[1].formatted_address;
                    }
                }
            });
        };

        $scope.loadPhoto();
    }]);