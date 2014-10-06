/* jshint node:true */
'use strict';

var serverUtil = require('./serverUtil');

function StoxServer(stoxWss, adminServer) {
    console.log('stox constructor');
    this.wss = stoxWss;
    this.adminServer = adminServer;
    this.bindConnection();
}

StoxServer.prototype.bindConnection = function() {
    var self = this;

    this.wss.on('connection', function(ws) {
        console.log('stox connection open');

        ws.on('open', function() {
            console.log('stox connection open2');
        });

        ws.on('close', function() {
            console.log('stox connection close');
        });

        serverUtil.identify(this, ws);
        self.adminServer.update(this.clients);
    });
};

// http://nodejs.org/docs/latest/api/util.html#util_util_inherits_constructor_superconstructor
// TODO reuse with client version of identify?
// see http://javascript.crockford.com/inheritance.html
// StoxServer.prototype.identify = function(ws) {
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

module.exports = StoxServer;