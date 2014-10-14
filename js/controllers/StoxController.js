/* jshint globalstrict:true */
/* globals stox, StoxSocket */
'use strict';

stox.controller('StoxController',
    function StoxController($scope) { //$interval) { //, $location, $route) {
        // $scope.activePath = null;
        // $scope.$on('$routeChangeSuccess', function(){
        //     $scope.activePath = $location.path();
        //     //console.log( $location.path() );
        // });
    
        /*var setBar = function(i) {
            console.log('setBar', i);
            $scope.testAttr = i;
            $scope.$apply();
        };*/

        $scope.barchart = [100, 100, 100];

        var updateBars = function(values) {
            console.log('updateBars', values);
            // $scope.testAttr = i;
            //$scope.stoxSocket.barchart = 10;
            $scope.barchart = values;
            $scope.$apply();
        };

        //$scope.testAttr = 50;
        $scope.stoxSocket = new StoxSocket(updateBars);

        //setBar(110);

        // $interval(function(){
        //     // var hour=$scope.salesData.length+1;
        //     // var sales= Math.round(Math.random() * 100);
        //     // $scope.salesData.push({hour: hour, sales:sales});

        //     var random = 50 + Math.round(Math.random() * 100);
        //     $scope.testAttr = random;
        // }, 2000, 10); // 2 second delay, 10 times
    }
);


/*

Service:

factory('MyService', [function() {

  var wsUrl = angular.element(document.querySelector('#ws-url')).val();
  var ws = new WebSocket(wsUrl);

  ws.onopen = function() {
    console.log("connection established ...");
  }
  ws.onmessage = function(event) {
      Service.messages.push(event.data);
  }   

  var Service = {};
  Service.messages = [];
  return Service;
}]);

Controller:

controller('MyCtrl1', ['$scope', 'MyService', function($scope, MyService) {
  $scope.messages = MyService.messages;
}])

Partial:

<ul>
  <li ng-repeat="msg in messages">
      {{msg}} 
  </li>
</ul>
*/
