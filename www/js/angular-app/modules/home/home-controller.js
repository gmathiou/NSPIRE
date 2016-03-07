var home = angular.module('home', ['ionic', 'ngCordova', '500px.service'])

home.controller('HomeController', [
    '$rootScope',
    '$scope',
    'FiveHundredService',
    '$cordovaGeolocation',
    '$ionicLoading',
    '$timeout',
    '$ionicPlatform',
    '$ionicModal',
    '$ionicScrollDelegate',
    function ($rootScope, $scope, FiveHundredService, $cordovaGeolocation, $ionicLoading, $timeout, $ionicPlatform, $ionicModal, $ionicScrollDelegate) {
        $scope.status = {};
        $scope.photos = [];
        $scope.status.currentPage = 1;
        $scope.photoCategories = FiveHundredService.photoCategories;
        $scope.filters = {};
        $scope.filters.range = 10;
        $scope.filters.sortingOptions = FiveHundredService.sortingOptions;
        $scope.status.selectedSorting = $scope.filters.sortingOptions[0].name;
        
        $scope.geoLocation = function () {
            $ionicLoading.show();
            var geolocOptions = { maximumAge: 60000, timeout: 3000, enableHighAccuracy: true };
            navigator.geolocation.getCurrentPosition(function (position) {
                if (!position) {
                    return;
                }
                console.log("Load from geolocation");
                $rootScope.coords = { lat: position.coords.latitude, lon: position.coords.longitude };
                $scope.loadPhotos();
            }, function (err) {
                // $ionicLoading.show({ template: 'Geolocation failed', duration: 5000 });
                console.error("Geolocation failed");
                $timeout(function () {
                    $scope.geoLocation();
                }, 1000);
            }, geolocOptions);
        };

        $scope.loadPhotos = function () {
            console.log("Start loading photos");
            FiveHundredService.getPhotos($rootScope.coords, $scope.filters.range, $scope.status.selectedSorting, $scope.status.currentPage).then(function (data) {
                if ($scope.status.currentPage > 1) {
                    $scope.photos = $scope.photos.concat(data);
                } else {
                    $scope.photos = data;
                }
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $ionicLoading.hide();
                console.log("Photos loaded");
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
            console.log("Load more data");
            if (!$rootScope.coords) {
                return;
            }
            $scope.status.currentPage = $scope.status.currentPage + 1;
            $scope.loadPhotos();
        };

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
            $scope.photos = [];
            $scope.status.showRetry = false;
            $ionicLoading.show();
            $scope.loadPhotos();
            $ionicScrollDelegate.scrollTop();
        };

        $ionicPlatform.ready(function () {
            console.log("ionic platform ready!");
            $scope.geoLocation();
        });

        $scope.photos = [];
        $scope.status.showRetry = true;
        $scope.status.showRetry = false;
        $timeout(function () {
            $scope.status.showRetry = true;
        }, 6000);
    }]);