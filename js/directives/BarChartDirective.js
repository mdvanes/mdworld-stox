/* jshint globalstrict:true */
/* globals stox */
'use strict';

stox.directive('barchart', function() {

    // TODO so far, the problem is that I can't update $scope.testAttr from onmessage in StoxSocket.js

    // see: http://www.sitepoint.com/creating-charting-directives-using-angularjs-d3-js/


    // see https://docs.angularjs.org/guide/directive

    // simple angular/websockets: http://stackoverflow.com/questions/21658490/angular-websocket-and-rootscope-apply

    // charting directive: http://www.sitepoint.com/creating-charting-directives-using-angularjs-d3-js/

    // websockets to angular directive: http://clintberry.com/2013/angular-js-websocket-service/
    // TODO example of how to update canvas from Angular directive: http://angular-ui.github.io/


    function link($scope, elem) {
        // Jquery animate on a div instead of canvas, because how to do motion tweening in canvas?
        // elem.find('#barchart > #bar-1')
        // //$('#testchart')
        //     .css({
        //         //'width': '75px',
        //         //'height': '45px',
        //         'background-color': '#008000'
        //     });
        //     //.animate({height: '120px'});
        // elem.find('#barchart > #bar-2')
        //     .css({
        //         //'height': '11px',
        //         //'width': '75px',
        //         'background-color': '#00c800'
        //     });
        // elem.find('#barchart > #bar-3')
        //     .css({
        //         //'height': '10px',
        //         //'width': '75px',
        //         'background-color': '#003000'
        //     });
        // elem.find('#barchart > div')
        //     .css({
        //         'display': 'inline-block',
        //         //'height': '10px',
        //         'width': '75px',
        //         'vertical-align': 'bottom'
        //     });

        // setTimeout(function() {
        //     $('#testchart')
        //         .css('width', '100px')
        //         .animate({height: '120px'});
        // }, 2000);
            
        // var c = document.getElementById('barchart');
        // var ctx = c.getContext('2d');
        // ctx.fillStyle = '#008000';
        // // x, y (inverted), width, height
        // ctx.fillRect(0,125,75,75);
        // ctx.fillStyle = '#00f000';
        // ctx.fillRect(75,25,75,175);
        // ctx.fillStyle = '#003000';
        // ctx.fillRect(150,100,75,100);

        var $bar1 = elem.find('#barchart > #bar-1');
        var $bar2 = elem.find('#barchart > #bar-2');
        var $bar3 = elem.find('#barchart > #bar-3');

        console.log('link', $scope.stoxSocket.barchart);
        //$scope.$watch('stockSocket.barchart', function() {
        $scope.$watch('barchart', function() {
            //alert('test ' + $scope.stoxSocket.barchart);
            console.log('$watch ' + $scope.barchart);
            $bar1.animate({height: $scope.barchart[0] + 'px'});
            $bar2.animate({height: $scope.barchart[1] + 'px'});
            $bar3.animate({height: $scope.barchart[2] + 'px'});
        }, true);
        //http://stackoverflow.com/questions/18854007/angular-watch-not-working
        // $scope.$watch('testAttr', function(newVal) {
        //     //alert('test ' + $scope.stoxSocket.barchart);
        //     var height = $scope.testAttr + 'px';
        //     console.log('$watch2 ' + height + ' ' + newVal );
        //     elem.find('#testchart').animate({height: $scope.testAttr + 'px'});
        // }, true);
    }
    
    return {
        //scope: {},
        restrict: 'E',
        replace: 'true',
        templateUrl: 'partials/barChart.html',
        link: link,
    };
});
