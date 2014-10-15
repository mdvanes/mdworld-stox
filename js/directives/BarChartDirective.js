/* jshint globalstrict:true */
/* globals stox */
'use strict';

stox.directive('barchart', function() {

    // see https://docs.angularjs.org/guide/directive
    // charting directive: http://www.sitepoint.com/creating-charting-directives-using-angularjs-d3-js/
    // websockets to angular directive: http://clintberry.com/2013/angular-js-websocket-service/
    // Angular-ui components http://angular-ui.github.io/

    function link($scope, elem) {
        // elem corresponds to $('#barchart')

        // Jquery animate on a div instead of canvas, because how to do motion tweening in canvas?
        var $bar1 = elem.find('#bar-1');
        var $bar2 = elem.find('#bar-2');
        var $bar3 = elem.find('#bar-3');

        // http://stackoverflow.com/questions/18854007/angular-watch-not-working
        // Supply scope variable to watch as string
        $scope.$watch('barchart', function() {
            $bar1.animate({height: $scope.barchart[0] + 'px'});
            $bar2.animate({height: $scope.barchart[1] + 'px'});
            $bar3.animate({height: $scope.barchart[2] + 'px'});
        }, true); // Supply true to allow deep watching
    }
    
    return {
        restrict: 'E',
        replace: 'true',
        templateUrl: 'partials/barChart.html',
        link: link,
    };
});
