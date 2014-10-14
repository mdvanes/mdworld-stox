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
        self.adminServer.update();
    });
};

module.exports = StoxServer;