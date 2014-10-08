/* jshint globalstrict:true */
/* globals stox, StoxSocket */
'use strict';

stox.controller('StoxController',
    function StoxController($scope, $interval) { //, $location, $route) {
        // $scope.activePath = null;
        // $scope.$on('$routeChangeSuccess', function(){
        //     $scope.activePath = $location.path();
        //     //console.log( $location.path() );
        // });
        $scope.testAttr = 50;
        $scope.stoxSocket = new StoxSocket($scope);

        $interval(function(){
            // var hour=$scope.salesData.length+1;
            // var sales= Math.round(Math.random() * 100);
            // $scope.salesData.push({hour: hour, sales:sales});

            var random = 50 + Math.round(Math.random() * 100);
            $scope.testAttr = random;
        }, 2000, 10); // 2 second delay, 10 times
    }
);
