"use strict";

var photoSingle = angular.module('photo.single', ['ionic', 'ngCordova', '500px.service'])

photoSingle.controller('PhotoSingleController', ['$rootScope', '$scope', 'FiveHundredService', '$cordovaGeolocation', '$stateParams', function ($rootScope, $scope, FiveHundredService, $cordovaGeolocation, $stateParams) {

    $scope.photoId = $stateParams.photoid;
    $scope.photoItem = null;
    
    if ($scope.photoId) {
        FiveHundredService.getPhoto($scope.photoId).then(function (data) {
            $scope.photoItem = data;
        }, function (error) {

        });
    }

}]);