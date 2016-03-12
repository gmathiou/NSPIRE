"use strict";

var photoSingle = angular.module('tabs', ['ionic', 'ngCordova', '500px.service', 'uiGmapgoogle-maps'])

photoSingle.controller('TabsController', ['$rootScope', '$scope', '$stateParams', '$ionicPlatform', function($rootScope, $scope, $stateParams, $ionicPlatform) {
    $scope.onTabSelected = function(index) {
        console.log("Navigate to tab: " + index);
        $rootScope.$broadcast('tabChanged', index);
    }
}]);