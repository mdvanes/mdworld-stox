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

        var self = this;
        $('.top-row a').click(function() {
            // When flowing away, close the current socket
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
                    break;
                case 'receiveNotification':
                    socketUtil.receiveNotification(response.data);
                    break;
                case 'receiveStockUpdate':
                    updateBars(response.data);
                    break;
            }
        };
    };

    // Expose
    window.StoxSocket = StoxSocket;
})(jQuery, window.socketUtil, window.GenericSocket);
