/* jshint globalstrict:true, unused:false */
/* globals angular */
'use strict';

// Declare app level module which depends on filters, and services
var stox = angular.module('stox', [
    'ngRoute',
    'ngResource',
    // 'appstore.filters',
    // 'appstore.services',
    // 'appstore.directives',
    // 'appstore.controllers'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/client', {templateUrl: 'partials/client.html', controller: 'StoxController'});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'AdminController'});
    $routeProvider.otherwise({redirectTo: '/client'});
}]);
