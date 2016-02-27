"use strict";

var photoSingle = angular.module('photo.single', ['ionic', 'ngCordova', '500px.service', 'uiGmapgoogle-maps'])

photoSingle.controller('PhotoSingleController', ['$rootScope', '$scope', 'FiveHundredService', '$cordovaGeolocation', '$stateParams', '$ionicPlatform', function ($rootScope, $scope, FiveHundredService, $cordovaGeolocation, $stateParams, $ionicPlatform) {

    $scope.photoId = $stateParams.photoid;
    $scope.photoItem = null;

    if ($scope.photoId) {
        FiveHundredService.getPhoto($scope.photoId).then(function (data) {
            $scope.photoItem = data;
            $scope.initMap();
        }, function (error) {

        });
    };

    $scope.initMap = function () {
        $scope.map = {
            center: {
                latitude: $scope.photoItem.photo.latitude,
                longitude: $scope.photoItem.photo.longitude
            },
            zoom: 16
        };

        $scope.marker = {
            id: 0,
            coords: {
                latitude: $scope.photoItem.photo.latitude,
                longitude: $scope.photoItem.photo.longitude
            },
            options: { draggable: false },
        };
    };
}]);