var home = angular.module('home', ['ionic', 'ngCordova', '500px.service', 'common.services'])

home.controller('HomeController', [
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
    'AppService',
    function($rootScope, $scope, HomeService, FiveHundredService, $cordovaGeolocation, $ionicLoading, $timeout, $ionicPlatform, $ionicModal, $ionicScrollDelegate, AppService) {
        $scope.status = HomeService.status;
        $scope.photos = HomeService.photos;
        $scope.photoCategories = HomeService.photoCategories;
        $scope.filters = HomeService.filters;

        $scope.geoLocation = function() {
            $ionicLoading.show();
            HomeService.getLocation().then(function(position) {
                console.log("Load from geolocation: ");
                console.log(position);
                $scope.loadPhotos();
            }, function(error) {
                console.error("Geolocation failed");
                $scope.geoLocation();
            });
        };

        $scope.loadPhotos = function() {
            console.log("Start loading photos");
            HomeService.loadPhotos().then(function(data) {
                $scope.photos = data;
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $ionicLoading.hide();
                console.log("Photos loaded");
            });
        };

        $scope.doRefresh = function() {
            $scope.loadPhotos();
        };

        $scope.distance = function(lat, lon) {
            var distance = AppService.getDistanceFromLatLonInKm(lat, lon, HomeService.myPosition.coords.latitude, HomeService.myPosition.coords.longitude);
            return distance;
        };

        $scope.loadMoreData = function() {
            console.log("Load more data");
            if (!HomeService.myPosition.coords) {
                return;
            }
            $scope.status.currentPage = $scope.status.currentPage + 1;
            HomeService.status.currentPage = $scope.status.currentPage;
            $scope.loadPhotos();
        };



        $ionicModal.fromTemplateUrl('js/angular-app/modules/modals/filters.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
            $scope.photos = [];
            $scope.status.showRetry = false;
            $ionicLoading.show();
            $scope.loadPhotos();
            $ionicScrollDelegate.scrollTop();
        };

        $ionicPlatform.ready(function() {
            console.log("ionic platform ready!");
            $scope.geoLocation();
        });

        $scope.photos = [];
        $scope.status.showRetry = false;
        $timeout(function() {
            $ionicLoading.hide();
            $scope.status.showRetry = true;
        }, 6000);
    }]);