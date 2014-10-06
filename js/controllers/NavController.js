/* jshint globalstrict:true */
/* globals stox */
'use strict';

stox.controller('NavController',
    function NavController($scope, $location) {
        $scope.activePath = null;
        $scope.$on('$routeChangeSuccess', function(){
            $scope.activePath = $location.path();
            //console.log( $location.path() );
        });
    }
);
