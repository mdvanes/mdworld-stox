/* jshint globalstrict:true */
/* globals stox, StoxSocket */
'use strict';

stox.controller('StoxController',
    function StoxController() { //$scope, $location, $route) {
        // $scope.activePath = null;
        // $scope.$on('$routeChangeSuccess', function(){
        //     $scope.activePath = $location.path();
        //     //console.log( $location.path() );
        // });
        new StoxSocket();
    }
);
