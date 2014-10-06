(function($, GenericSocket) {
    'use strict';

    var StoxSocket = function() {
        console.log('StoxSocket init');
        var host = location.origin.replace(/^http/, 'ws');
        this.ws = new WebSocket(host + '/stox');
        console.log('ws', this.ws);

        new GenericSocket(this.ws);

        this.bindMessage();

        var self = this;
        $('.top-row a').click(function() {
            // when flowing away, close the current socket
            self.ws.close();
        });
    };

    StoxSocket.prototype.bindMessage = function() {
        var self = this;
        this.ws.onmessage = function(msg) {
            console.log(msg);
            var response = JSON.parse(msg.data);
            switch (response.action) {
                case 'identify':
                    self.port = response.port;
                    self.ip = response.ip;
                    $('#clientInfo')
                        .attr('title', self.ip + ':' + self.port )
                        .tooltip();
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

    // expose
    window.StoxSocket = StoxSocket;
})(jQuery, window.GenericSocket);
