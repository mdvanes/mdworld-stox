(function($) {
    var StatusSocket = function() {
        console.log('StatusSocket init');
        var host = location.origin.replace(/^http/, 'ws');
        this.ws = new WebSocket(host);
        this.bindOpen();
        this.bindClose();
        this.bindMessage();
    };

    StatusSocket.prototype.bindOpen = function() {
        this.ws.onopen = function(msg) {
            console.log('open');
            $('#status')
                .removeClass()
                .addClass('online')
                .html('connected');
        };
    };

    StatusSocket.prototype.bindClose = function() {
        this.ws.onclose = function(msg) {
            console.log('close');
            return $('#status')
                .removeClass()
                .addClass('offline')
                .html('disconnected');
        };
    };

    StatusSocket.prototype.bindMessage = function() {
        var self = this;
        this.ws.onmessage = function(msg) {
            console.log(msg);
            var response = JSON.parse(msg.data);
            switch (response.action) {
                case 'identify':
                    //console.log(response.data);
                    self.port = response.port;
                    self.ip = response.ip;
                    $('.statusSocketId').text( self.ip + ':' + self.port );
                    break;
                case "statusMsg":
                    return self.statusMsg(response.data);
                case "clientConnected":
                    return self.clientConnected(response.data);
                case "clientDisconnected":
                    return self.clientDisconnected(response.data);
                case "clientActivity":
                    return self.clientActivity(response.data);
                case "serverInfo":
                    return self.refreshServerinfo(response.data);
            }
        };
    };

    // expose
    window.StatusSocket = StatusSocket;
})(jQuery);
