'use strict';

var app = angular.module('starter', ['ionic', 'ngCordova', 'home', 'photo_single' ,'tabs']);

app.run(function ($ionicPlatform, $cordovaStatusbar) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        
        if (window.StatusBar) {
            StatusBar.overlaysWebView(true)
            //StatusBar.styleDefault(2);
        }
    });
});

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'js/angular-app/modules/tabs/tabs.html',
        controller: 'TabsController'
    });

    $stateProvider.state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'js/angular-app/modules/home/home.html',
                controller: 'HomeController'
            }
        }
    });

    $stateProvider.state('tab.photo', {
        url: '/home/photo/:photoid',
        views: {
            'tab-home': {
                templateUrl: 'js/angular-app/modules/photo-single/photo-single.html',
                controller: 'PhotoSingleController'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('tab/home');
});
