var websockets = {};

websockets.globals = {
    statusUrl: 'ws://' + location.hostname + ':8000/status',
    stoxUrl: 'ws://' + location.hostname + ':8000/stox'
};

websockets.classes = {};

/**
 @class StatusSocket 
 **/
websockets.classes.StatusSocket = function() {
    self.port;
    this.socket;
    this.initSocket();
    this.setSocketEventBindings();
};

websockets.classes.StatusSocket.prototype = {
    initSocket: function() {
        if (window.MozWebSocket) {
            this.socket = new MozWebSocket(websockets.globals.statusUrl);
        } else if (window.WebSocket) {
            this.socket = new WebSocket(websockets.globals.statusUrl);
        }
    },
    setSocketEventBindings: function() {
        var self = this;
        this.socket.onopen = function(msg) {
            return $('#status').removeClass().addClass('online').html('connected');
        };
        this.socket.onclose = function(msg) {
            return $('#status').removeClass().addClass('offline').html('disconnected');
        };
        this.socket.onmessage = function(msg) {
            var response;
            response = JSON.parse(msg.data);
            switch (response.action) {
                case 'identify':
                    self.port = response.data;
                    $('.statusSocketId').text( self.port );
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
    },
    setBindings: function() {
        $('#status').click(function() {
            return this.socket.close();
        });
    },
    clientConnected: function(data) {
        $('#clientList').append( new websockets.classes.ClientItem( data.ip, data.port ) );
        return $('#clientCount').text(data.clientCount);
    },
    clientDisconnected: function(data) {
        $('#clientList li[rel="' + data.port + '"]').remove();
        return $('#clientCount').text(data.clientCount);
    }, 
    clientActivity: function(port) {
        return $('#clientList li[rel="' + port + '"]');
    }, 
    refreshServerinfo: function(serverinfo) {
        var ip, port, _ref, _results;
        /*
        $('#clientCount').text(serverinfo.clientCount);
        $('#maxClients').text(serverinfo.maxClients);
        $('#maxConnections').text(serverinfo.maxConnectionsPerIp);
        $('#maxRequetsPerMinute').text(serverinfo.maxRequetsPerMinute);
        */
        _ref = serverinfo.clients;
        _results = [];
        for (port in _ref) {
            ip = _ref[port];
            _results.push($('#clientList').append( new websockets.classes.ClientItem( ip, port )) );
        }
        return _results;
    },
    statusMsg: function(msgData) {
        var self = this;
        switch (msgData.type) {
            case "info":
                return websockets.util.log(msgData.text);
            case "warning":
                return websockets.util.log("<span class=\"warning\">" + msgData.text + "</span>");
        }
    }
};

websockets.classes.ClientItem = function(ip, port) {
    var $li = $('<li rel="' + port + '"></li>');
    var $nameSpan = $('<span class="name">' + ip + ':' + port + '</span>');
    var $msgButton = $('<span class="aq-button message">Stuur Bericht</span>');
    var $inspectButton = $('<span class="aq-button inspect">Inspecteer</span>');
    $li.append($nameSpan);
    if( port != $('.statusSocketId').text() 
        && port != $('.adminSocketId').text() ) {
        $li.append($msgButton);
        $li.append($inspectButton);
        $li.append( tmpl("button3_tmpl", null) );
    }/* else if() {

    } else if() {
        
    }*/
    return $li;
}

/**
 @class StoxAdminSocket 
 **/
websockets.classes.StoxAdminSocket = function() {
    this.port;
    this.socket = websockets.util.initSocket( websockets.globals.stoxUrl );
    this.setSocketEventBindings();
    this.setBindings();
};

websockets.classes.StoxAdminSocket.prototype = {
    setSocketEventBindings: function() {
        var self = this;
        this.socket.onopen = function(msg) {
            //return $('#status').removeClass().addClass('online').html('connected');
        };
        this.socket.onmessage = function(msg) {
            var response;
            response = JSON.parse(msg.data);
            switch (response.action ) {
                case 'receiveMouse':
                    self.mirror.receiveMouse(response);
                    return;
                case 'identify':
                    self.port = response.data;
                    $('.adminSocketId').text( self.port );
                default:
                    websockets.util.log('Action: ' + response.action);
                    websockets.util.log('Data: ' + response.data);                    
            }
        };
        this.socket.onclose = function(msg) {
            //return $('#status').removeClass().addClass('offline').html('disconnected');
        };
    },
    setBindings: function() {
        var self = this;
        $('#status').click(function() {
            self.socket.close();
        });
        $('#send').click(function() {
            var payload;
            payload = new Object();
            payload.action = 'identify';
            payload.data = '';
            self.socket.send(
                JSON.stringify(payload)
            );
        });
        $('.updateStock').mouseup(function() {
            var payload;
            payload = new Object();
            payload.action = 'updateStock';
            payload.data = $(this).val();
            payload.for = $(this).data('for');
            self.socket.send(
                JSON.stringify(payload)
            );
        });
        $('#clientList')
            .on('click', 'li .message', function(){
                var port = $(this).closest('li').attr('rel');
                self.sendNotification(port);
            })
            .on('click', 'li .inspect', function(){
                $('#clientList .inspect').removeClass('active');
                $(this).addClass('active');
                var port = $(this).closest('li').attr('rel');
                self.mirror.showMirror(port);
            })
            .on('click', 'li .pong', function(){
                var $elem = $('.runtime');
                var from = self.port;
                var to = $(this).closest('li').attr('rel');
                if( $elem.is('.pong') ) {
                    alert('Already connected.');
                } else if( from == to ) {
                    alert('Cannot connect to self.')
                } else {
                    new pong.classes.Pong(from, to, $elem);
                }
            });
    },
    sendNotification: function(port) {
        var self = this;
        var mesg = window.prompt('Type the message to send to the client ' + port + ':');
        if( mesg != null ) {
            var payload;
            payload = new Object();
            payload.action = 'sendNotification';
            payload.data = mesg;
            payload.to = port;
            self.socket.send(
                JSON.stringify(payload)
            );
        }
    },
    mirror: {
        enabled: false,
        port: null,
        showMirror: function(port) {
            $('#mirror')
                .empty()
                .css('display', 'inline-block');
            this.enabled = true;
            this.port = port;
        },
        receiveMouse: function(response) {
            if( this.enabled && this.port == response.from ) {
                // scale: original width 800 mirror width 365 = x / 2,19
                var scale = 2.19;
                $('#mirror')
                    .empty()
                    .text( this.port + ':' + response.mouseX + ',' + response.mouseY);
                var $pointer = $('<div class="pointer"></div>');
                $pointer
                    .css('top', Math.round( response.mouseY / scale ) )
                    .css('left', Math.round( response.mouseX / scale ) );
                $('#mirror').append( $pointer );                
            }
        }        
    }
};

/**
 @class StoxClientSocket 
 **/
websockets.classes.StoxClientSocket = function() {
    this.socket = websockets.util.initSocket( websockets.globals.stoxUrl );
    this.setSocketEventBindings();
    this.setBindings();
};

websockets.classes.StoxClientSocket.prototype = {
    setSocketEventBindings: function() {
        var self = this;
        this.socket.onopen = function(msg) {
            return $('#status').removeClass().addClass('online').html('connected');
        };
        this.socket.onmessage = function(msg) {
            var response;
            response = JSON.parse(msg.data);
            /*websockets.util.log("Action: " + response.action);
            websockets.util.log("Data: " + response.data);*/
            switch (response.action) {
                case "identify":
                    $('#aq-explain-text-identifier').text( response.data );
                    return;
                case "updateStock":
                    self.setUpdatedStock(response);
                    return;
                case "receiveNotification":
                    self.receiveNotification(response);
                    return;
            }
        };
        this.socket.onclose = function(msg) {
            return $('#status').removeClass().addClass('offline').html('disconnected');
        };
    },
    setBindings: function() {
        var self = this;
        $('#status').click(function() {
            self.socket.close();
        });
        $('#runtime').mousemove(function(event) {
            // mouse position relative to #runtime
            var mouseX = Math.round(event.pageX - $('#runtime').offset().left);
            var mouseY = Math.round(event.pageY - 15);
            var payload = new Object();
            payload.action = 'sendMouse';
            payload.data = 'someData';
            payload.mouseX = mouseX;
            payload.mouseY = mouseY;
            payload.from = $('#aq-explain-text-identifier').text();
            self.socket.send(
                JSON.stringify(payload)
            );
        });
    },
    setUpdatedStock: function(response) {
        if( response.for == 'inr' ) {
            $('#chart li.Initrode').css( 'height', response.data+'px' );
        } else if( response.for == 'cls' ) {
            $('#chart li.CollaboSmart').css( 'height', response.data+'px' );
        } else if( response.for == 'umb' ) {
            $('#chart li.Umbrella').css( 'height', response.data+'px' );
        }
        $('.max-' + response.for ).text( response.data );
    },
    receiveNotification: function(response) {
        /*'action' => 'receiveNotification',
                    'data' => $decodedData['data']*/
        //alert('Notification: ' + response.data );
        $('#stox-message').text( response.data );
        $('.notifications').css('display','inline-block');
    }
};

/**
 @function util functions
 **/
websockets.util = {};
websockets.util.initSocket = function(url) {
    if (window.MozWebSocket) {
        return new MozWebSocket(url);
    } else if (window.WebSocket) {
        return new WebSocket(url);
    } 
    return null;
};

websockets.util.log = function(msg) {
    $('#log').prepend("" + msg + "<br />");
}

websockets.util.displayNotification = function() {
    alert( $('#stox-message').text() );
    $('.notifications').css('display','none');
}

$(document).ready(function(){
    if( $('#runtime').is('.admin') ) {
        new websockets.classes.StatusSocket();
        new websockets.classes.StoxAdminSocket();
    } else if( $('#runtime').is('.client') ) {
        new websockets.classes.StoxClientSocket();
    }
});