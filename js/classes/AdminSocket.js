(function($, socketUtil, GenericSocket) {
    'use strict';

    var AdminSocket = function() {
        console.log('AdminSocket init');
        var host = location.origin.replace(/^http/, 'ws');
        this.ws = new WebSocket(host + '/admin');
        console.log('ws: ', this.ws);
        log('AdminSocket init: ' + this.ws);
        //log('ws: ' + this.ws);
        // log('ws2: ' + JSON.stringify(this.ws, null, 4));
        // log('ws3: ' + this.ws.toSource());
        // this.bindOpen();
        // this.bindClose();
        new GenericSocket(this.ws);
        this.bindMessage();

        var self = this;
        $('.top-row a').click(function() {
            // when flowing away, close the current socket
            self.ws.close();
        });
        socketUtil.hello();
    };

    // AdminSocket.prototype.bindOpen = function() {
    //     this.ws.onopen = function() {
    //         console.log('AdminSocket open');
    //         $('#status')
    //             .removeClass()
    //             .addClass('label label-success')
    //             .html('connected');
    //     };
    // };

    // AdminSocket.prototype.bindClose = function() {
    //     this.ws.onclose = function() {
    //         console.log('AdminSocket close');
    //         return $('#status')
    //             .removeClass()
    //             .addClass('label label-danger')
    //             .html('disconnected');
    //     };
    // };

    AdminSocket.prototype.bindMessage = function() {
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
                    log('adminstatus: ' + JSON.stringify(response.clients, null, 4));
                    self.updateConnectedClients(response.clients);
                    break;
                case 'statusMsg':
                    return self.statusMsg(response.data);
                case 'clientConnected':
                    return self.clientConnected(response.data);
                case 'clientDisconnected':
                    return self.clientDisconnected(response.data);
                case 'clientActivity':
                    return self.clientActivity(response.data);
                case 'serverInfo':
                    return self.refreshServerinfo(response.data);
                default: 
                    log(response);
            }
        };
    };

    AdminSocket.prototype.updateConnectedClients = function(clients) {
        var self = this;
        // TODO rewrite for Angular (templates, ng-foreach)
        // see http://clintberry.com/2013/angular-js-websocket-service/
        var $table = $('#connected-clients');
        $table.empty();
        $.each(clients, function() {
            var $html = $('<tr><td>id</td><td>' +
                this.port + '</td><td class="type">' +
                this.type + '</td></tr>');
            if( this.port === self.port ) {
                // Current admin page specific
                $html.addClass('current');
                $html.find('.type')
                    .attr('title', 'This admin page')
                    .append(' <span class="glyphicon glyphicon-flag"></span>');
                $html.append('<td></td>');
            } else {
                // Not current admin page specific
                var port = this.port;
                var $msgButton = $('<td title="send notification"><span class="glyphicon glyphicon-envelope"></span></td>');
                $msgButton.click(function() {
                    self.sendNotification(port);
                });
                $html.append($msgButton);                
            }
            $table.append($html);
        });
    };

    AdminSocket.prototype.sendNotification = function(port) {
        var self = this;
        var msg = window.prompt('Type the message to send to the client ' + port + '.\n\nMessage:');
        if( msg !== null ) {
            var payload = {
                action: 'sendNotification',
                data: msg,
                to: port
            };
            var jsonPayload = JSON.stringify(payload);
            self.ws.send(jsonPayload);
            log('send notification' + jsonPayload);
        }
    };

    function log(msg) {
        var timestamp = (new Date()).toLocaleString();
        $('#log').prepend('<tr><td class="timestamp">' + timestamp +
            '</td><td>' + msg + '</td></tr>');
    }

    // expose
    window.AdminSocket = AdminSocket;
})(jQuery, window.socketUtil, window.GenericSocket);
