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
                .addClass('label label-success')
                .html('connected');
        };
    };

    StatusSocket.prototype.bindClose = function() {
        this.ws.onclose = function(msg) {
            console.log('close');
            return $('#status')
                .removeClass()
                .addClass('label label-danger')
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
                    self.port = response.port;
                    self.ip = response.ip;
                    $('#clientInfo')
                        .attr('title', self.ip + ':' + self.port )
                        .tooltip();
                    break;
                case 'adminUpdate':
                    // TODO only in AdminSocket
                    //console.log('adminstatus', response.clients);
                    updateConnectedClients(response.clients);
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

    function updateConnectedClients(clients) {
        var $table = $('#connected-clients');
        $table.empty();
        $.each(clients, function() {
            $table.append('<tr><td>id</td><td>' + this + '</td></tr>');
        });
    }

    // expose
    window.StatusSocket = StatusSocket;
})(jQuery);
