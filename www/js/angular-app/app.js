'use strict';

var app = angular.module('starter', ['ionic', 'ngCordova', 'home', 'photo.single']);

app.run(function ($ionicPlatform, $cordovaStatusbar) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        $cordovaStatusbar.overlaysWebView(true)
        $cordovaStatusBar.style(3) //Light
    });
});

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'js/angular-app/modules/tabs/tabs.html'
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
