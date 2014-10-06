/* jshint globalstrict:true */
/* globals stox, AdminSocket */
'use strict';

stox.controller('AdminController',
    function AdminController() {//$scope, $location, $route) {
        // $scope.activePath = null;
        // $scope.$on('$routeChangeSuccess', function(){
        //     $scope.activePath = $location.path();
        //     //console.log( $location.path() );
        // });
        //new StatusSocket();

        // var host = location.origin.replace(/^http/, 'ws');
        // var ws = new WebSocket(host + '/admin');
        // ws.onopen = function() {
        //     console.log('adminsocket open');
        // };
        new AdminSocket();
    }
);
