var fivehundred = angular.module('500px.service', []);

fivehundred.service('FiveHundredService', function ($q, $http) {
    var self = this;
    self.consumer_Key = "IeFJJPcIoI76MzyxFvIjGGSAHTre2UuDFrp55xfQ";

    self.getPhotos = function (coords, km) {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: 'https://api.500px.com/v1/photos/search',
            params: {
                'geo': coords.lat + ',' + coords.lon + ',' + km + 'km',
                'sort':'_score',
                'consumer_key': self.consumer_Key
            }
        })
            .success(function (data, status, headers, config) {
                defer.resolve(data.photos);
            })
            .error(function (error, code) {
                defer.reject(error);
            })
            .finally(function () {

            });
        return defer.promise;
    };

    self.getPhoto = function (id) {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: 'https://api.500px.com/v1/photos/' + id,
            params: {
                'image_size': 3,
                'comments': 0,
                'consumer_key': self.consumer_Key
            }
        })
            .success(function (data, status, headers, config) {
                defer.resolve(data);
            })
            .error(function (error, code) {
                defer.reject(error);
            })
            .finally(function () {

            });
        return defer.promise;
    }
});
