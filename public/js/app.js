"use strict";

// 导入module
// ngRoute路由配置
// toastr消息提醒
var app = angular.module('myApp', ['ngAnimate', 'ngRoute', 'toastr']);

// routeProvider提供路由配置
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
    when('/about', {
        title: 'About',
        templateUrl: 'partials/about',
        controller: AboutCtrl
    }).
    when('/new_function', {
        title: 'New function',
        templateUrl: 'partials/new_function',
        controller: new_functionCtrl
    }).
    when('/browse/user/:userEmail', {
        title: 'My profile',
        templateUrl: 'partials/myprofile',
        controller: BrowseUserCtrl
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
    // 默认路由地址——没有找到的路径自动跳转
    otherwise({
        redirectTo: '/'
    });
    $locationProvider.html5Mode(true); // HTML5模式的路由，可以直接去掉#号
});
