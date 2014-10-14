(function($, socketUtil, GenericSocket) {
    'use strict';

    // TODO replace updateBars with Service/Factory as described in StoxController.js comments
    var StoxSocket = function(updateBars) {
        console.log('StoxSocket init');
        var host = location.origin.replace(/^http/, 'ws');
        this.ws = new WebSocket(host + '/stox');
        console.log('ws', this.ws);

        new GenericSocket(this.ws);

        this.bindMessage(updateBars);

        // TODO testvalue to see if directive can access it
        //this.barchart = 3;
        //this.testAttr = 
        //$scope.testAttr = 4;
        //this.$scope = $scope;

        var self = this;
        $('.top-row a').click(function() {
            // when flowing away, close the current socket
            self.ws.close();
        });
    };

    StoxSocket.prototype.bindMessage = function(updateBars) {
        var self = this;
        this.ws.onmessage = function(msg) {
            console.log('onmsg', msg);
            var response = JSON.parse(msg.data);
            switch (response.action) {
                case 'identify':
                    socketUtil.receiveIdentify(self, response);
                    // self.port = response.port;
                    // self.ip = response.ip;
                    // $('#clientInfo')
                    //     .attr('title', self.ip + ':' + self.port )
                    //     .tooltip();
                    break;
                case 'receiveNotification':
                    //self.barchart = 5;//response.data;
                    //updateBars([10, 20, 30]);
                    // console.log('receiveNotification $scope');
                    // //self.$scope.testAttr = 5; //response.data;
                    // //$scope.testAttr = 5;
                    // setBar(130);

                    //console.log('self.barchart' + self.barchart);
                    socketUtil.receiveNotification(response.data);
                    break;
                case 'receiveStockUpdate':
                    updateBars(response.data);
                    break;
                // case 'statusMsg':
                //     return self.statusMsg(response.data);
                // case 'clientConnected':
                //     return self.clientConnected(response.data);
                // case 'clientDisconnected':
                //     return self.clientDisconnected(response.data);
                // case 'clientActivity':
                //     return self.clientActivity(response.data);
                // case 'serverInfo':
                //     return self.refreshServerinfo(response.data);
            }
        };
    };

    // TODO add receiveNotification to admin or make generic
    // function receiveIdentify(self, response) {
    //     self.port = Number.parseInt(response.port);
    //     self.ip = response.ip;
    //     $('#clientInfo')
    //         .attr('title', self.ip + ':' + self.port )
    //         .tooltip();        
    // }

    // TODO add receiveNotification to admin or make generic
    // function receiveNotification(msg) {
    //     //alert('received: ' + msg);
    //     $('.top-row > div').find('.notifications').remove();
    //     $('.top-row > div').append('<div class="notifications">1 ' + msg + '</div>');
    // }


    // expose
    window.StoxSocket = StoxSocket;
})(jQuery, window.socketUtil, window.GenericSocket);
