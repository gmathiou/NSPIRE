home.service('HomeService', ['$q', '$http', 'FiveHundredService', function($q, $http, FiveHundredService) {
    var service = this;

    service.myPosition = {};
    service.geolocOptions = { maximumAge: 60000, timeout: 3000, enableHighAccuracy: true };

    service.photos = [];
    service.photoCategories = FiveHundredService.photoCategories;

    service.filters = {};
    service.filters.range = 10;
    service.filters.sortingOptions = FiveHundredService.sortingOptions;

    service.status = {};
    service.status.currentPage = 1;
    service.status.selectedSorting = service.filters.sortingOptions[0].name;

    service.getLocation = function() {
        var defer = $q.defer();
        if(service.myPosition.coords){
            defer.resolve(service.myPosition);
        }
        navigator.geolocation.getCurrentPosition(function(position) {
            if (!position) {
                defer.reject();
            }
            service.myPosition = position;
            defer.resolve(position);
        }, function(err) {
            defer.reject();
        }, service.geolocOptions);
        return defer.promise;
    };

    service.loadPhotos = function() {
        var defer = $q.defer();
        FiveHundredService.getPhotos(service.myPosition, service.filters.range, service.status.selectedSorting, service.status.currentPage).then(function(data) {
            if (service.status.currentPage > 1) {
                service.photos = service.photos.concat(data);
            } else {
                service.photos = data;
            }
            defer.resolve(service.photos);
        });
        return defer.promise;
    };
}]);
