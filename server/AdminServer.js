/* jshint node:true */
'use strict';

var serverUtil = require('./serverUtil');

function AdminServer(adminWss) {
    console.log('adminserver constructor');
    this.wss = adminWss;
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
            //ws.send('test open2');
        });

        ws.on('close', function() {
            //ws.send('test close');
            console.log('adminWss connection close');
            //clearInterval(id);
        });

        // createNewClient(ws);
        //self.identify(ws);
        serverUtil.identify(this, ws);
        // updateAdmins();
        self.update();
    });    
};

// // TODO reuse with client version of identify?
// // see http://javascript.crockford.com/inheritance.html
// AdminServer.prototype.identify = function(ws) {
//     var clients = this.wss.clients;
//     var newestSocketIndex = clients.length - 1;
//     var newestSocketInfo = clients[newestSocketIndex]._socket;
//     var msg = {
//         action: 'identify',
//         //data: '1234', // wss.clients[0]
//         ip: newestSocketInfo.remoteAddress,
//         port: newestSocketInfo.remotePort
//     };
//     // console.log(newestSocketInfo.address().address + ' ' +
//     //     newestSocketInfo.address().port + ' ' +
//     //     newestSocketInfo.remoteAddress + ' ' +
//     //     newestSocketInfo.remotePort);
//     ws.send(JSON.stringify(msg));
// };

// convert ws.clients to an infolist
function clientsToInfo(clients, type) {
    var i, port, clientInfo;
    var clientlist = [];
    if( typeof clients !== 'undefined' ) {
        for (i = 0; i < clients.length; i++) {
            port = clients[i]._socket.remotePort;
            clientInfo = {
                port: port,
                type: type
            };
            clientlist.push(clientInfo);
        }
    }
    return clientlist;
}

// TODO rename sendUpdate?
AdminServer.prototype.update = function(clients) {
    var clientlist = [];
    clientlist = clientlist.concat( clientsToInfo(clients, 'client') );
    clients = this.wss.clients;
    clientlist = clientlist.concat( clientsToInfo(clients, 'admin') );

    var msg = {
        action: 'adminUpdate',
        clients: clientlist
    };

    this.broadcast(JSON.stringify(msg));
};

AdminServer.prototype.broadcast = function(data) {
    //console.log('broadcast to ' + this.wss.clients.length, this.wss.clients);
    var clients = this.wss.clients;
    for (var i in clients) {
        clients[i].send(data);
    } 
};

module.exports = AdminServer;
