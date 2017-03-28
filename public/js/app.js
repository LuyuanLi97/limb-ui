"use strict";

var app = angular.module('myApp', ['ngRoute', 'toastr']);

app.config(function config($locationProvider, $routeProvider) {
    $routeProvider.
    when('/', {
        title: 'Home',
        templateUrl: 'partials/index',
        controller: IndexCtrl
    }).
    when('/browse', {
        title: 'Browse',
        templateUrl: 'partials/browse',
        controller: BrowseCtrl
    }).
    when('/browse/user/:userName', {
        title: 'My profile',
        templateUrl: 'partials/myprofile',
        controller: BrowseUserCtrl
    }).
    when('/signup', {
        title: 'Register',
        templateUrl: 'partials/signup',
        controller: SignupCtrl
    }).
    when('/signin', {
        title: 'Signin',
        templateUrl: 'partials/signin',
        controller: SigninCtrl
    }).
    when('/myprofile', {
        title: 'My profile',
        templateUrl: 'partials/myprofile',
        controller: MyprofileCtrl
    }).
    when('/mymessages', {
        title: 'My messages',
        templateUrl: 'partials/mymessages',
        controller: MymessagesCtrl
    }).
    when('/requests', {
        title: 'Requests',
        templateUrl: 'partials/requests',
        controller: RequestsCtrl
    }).
    when('/help', {
        title: 'Help',
        templateUrl: 'partials/help',
        controller: HelpCtrl
    }).
    when('/signout', {
        title: 'Signout',
        templateUrl: 'partials/myprofile',
        controller: SignoutCtrl
    }).
    when('/leaf', {
        title: 'Leaf',
        templateUrl: 'partials/leaf',
        controller: LeafCtrl
    }).
    when('/leaf/:leafId', {
        templateUrl: 'partials/leaf',
        controller: LeafCtrl
    }).
    when('/settings', {
        title: 'Settings',
        templateUrl: 'partials/settings',
        controller: SettingsCtrl
    }).
    otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true); // HTML5模式的路由，可以直接去掉#号
});
