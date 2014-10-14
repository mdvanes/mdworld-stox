/* jshint node:true */
'use strict';

var serverUtil = require('./serverUtil');

// convert ws.clients to an hashmap by port
function clientsToMap(map, clients, type) {
    var i, port, clientInfo, client;
    if( typeof clients !== 'undefined' ) {
        for (i = 0; i < clients.length; i++) {
            client = clients[i];
            port = client._socket.remotePort;
            clientInfo = {
                src: client,
                type: type
            };
            map[port] = clientInfo;
        }
    }
    return map;
}

// returns an object like { port : { src: ws.clients[i], type: 'client/admin' } }
function getClientMap(stoxClients, adminClients) {
    var clientmap = {};
    var clients = stoxClients;
    clientmap = clientsToMap(clientmap, clients, 'client');
    clients = adminClients;
    clientmap = clientsToMap(clientmap, clients, 'admin');
    return clientmap;
}

function clientmapToInfo(clientmap) {
    var port, type, clientInfo;
    var clientlist = [];
    for(port in clientmap) {
        type = clientmap[port].type;
        clientInfo = {
            port: port,
            type: type
        };
        clientlist.push(clientInfo);
    }
    return clientlist;
}

function AdminServer(adminWss, stoxWss) {
    console.log('adminserver constructor');
    this.wss = adminWss;
    this.stoxWss = stoxWss;
    this.bindConnection();
}

AdminServer.prototype.bindConnection = function() {
    var self = this;
    this.wss.on('connection', function(ws) {
        // var id = setInterval(function() {
        //     ws.send(JSON.stringify(new Date()), function() {  });
        // }, 50000);

        console.log('adminWss connection open');

        ws.on('open', function() {
            console.log('adminWss connection open2');
        });

        ws.on('close', function() {
            console.log('adminWss connection close');
            //clearInterval(id);
        });

        self.bindMessage(ws);

        serverUtil.identify(this, ws);
        self.update();
    });    
};

// TODO rename sendUpdate?
AdminServer.prototype.update = function() {
    var clientlist = [];
    var clientmap = getClientMap(this.stoxWss.clients, this.wss.clients);
    clientlist = clientmapToInfo(clientmap);

    var msg = {
        action: 'adminUpdate',
        clients: clientlist
    };

    this.broadcast(JSON.stringify(msg));
};

// Broadcast to Admin Clients
AdminServer.prototype.broadcast = function(data) {
    var clients = this.wss.clients;
    for (var i in clients) {
        clients[i].send(data);
    } 
};

AdminServer.prototype.broadcastToStoxClients = function(data) {
    var clients = this.stoxWss.clients;
    for (var i in clients) {
        clients[i].send(data);
    } 
};

AdminServer.prototype.bindMessage = function(ws) {
    var self = this;
    ws.on('message', function(msg) {
        var receivedMsg = JSON.parse(msg);
        var payload;
        //console.log('bindMessage receivedMsg: ', receivedMsg);
        if(receivedMsg.action === 'sendNotification') {
            payload = {
                action: 'receiveNotification',
                data: receivedMsg.data
            };
            // TODO is it efficient to call getClientMap this often?
            var clientmap = getClientMap(self.stoxWss.clients, self.wss.clients);
            var targetClient = clientmap[receivedMsg.to];
            targetClient.src.send(JSON.stringify(payload));
        } else if(receivedMsg.action === 'broadcastStockUpdate') {
            payload = {
                action: 'receiveStockUpdate',
                data: receivedMsg.data
            };
            self.broadcastToStoxClients(JSON.stringify(payload));
        }
    });
};

module.exports = AdminServer;
