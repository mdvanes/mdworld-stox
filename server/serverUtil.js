/* jshint node:true */
'use strict';

var serverUtil = {};

serverUtil.identify = function(wss, ws) {
    var clients = wss.clients;
    var newestSocketIndex = clients.length - 1;
    var newestSocketInfo = clients[newestSocketIndex]._socket;
    var msg = {
        action: 'identify',
        //data: '1234', // wss.clients[0]
        ip: newestSocketInfo.remoteAddress,
        port: newestSocketInfo.remotePort
    };
    // console.log(newestSocketInfo.address().address + ' ' +
    //     newestSocketInfo.address().port + ' ' +
    //     newestSocketInfo.remoteAddress + ' ' +
    //     newestSocketInfo.remotePort);
    ws.send(JSON.stringify(msg));
};

module.exports = serverUtil;