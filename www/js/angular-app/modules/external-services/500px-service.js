var fivehundred = angular.module('500px.service', []);

fivehundred.service('FiveHundredService', function ($q, $http) {
    var self = this;
    self.consumer_Key = key;

    self.getPhotos = function (coords, km, page) {
        var catString = '';
        for (var i = 0; i < self.photoCategories.length; i++){
            if (self.photoCategories[i].checked == true) {
                catString = catString + self.photoCategories[i].name + ", "
            }
        }
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: 'https://api.500px.com/v1/photos/search',
            params: {
                'geo': coords.lat + ',' + coords.lon + ',' + km + 'km',
                'sort': 'rating',
                'image_size': 600,
                'page': page,
                'only': catString,
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
                'image_size': 4,
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
    };

    self.photoCategories = [
        { id: 0, name: 'Uncategorized' },
        { id: 10, name: 'Abstract' },
        { id: 11, name: 'Animals' },
        { id: 5, name: 'Black and White' },
        { id: 1, name: 'Celebrities' },
        { id: 9, name: 'City and Architecture' },
        { id: 15, name: 'Commercial' },
        { id: 16, name: 'Concert' },
        { id: 20, name: 'Family' },
        { id: 14, name: 'Fashion' },
        { id: 2, name: 'Film' },
        { id: 24, name: 'Fine Art' },
        { id: 23, name: 'Food' },
        { id: 3, name: 'Journalism' },
        { id: 8, name: 'Landscapes' },
        { id: 12, name: 'Macro' },
        { id: 18, name: 'Nature' },
        { id: 4, name: 'Nude' },
        { id: 7, name: 'People' },
        { id: 18, name: 'Performing Arts' },
        { id: 6, name: 'Still Life' },
        { id: 21, name: 'Street' },
        { id: 26, name: 'Transportation' },
        { id: 13, name: 'Travel' },
        { id: 22, name: 'Underwater' },
        { id: 27, name: 'Urban Exploration' },
        { id: 25, name: 'Wedding' }
    ]
});
