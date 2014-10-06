/* jshint strict:false, node:true */
/* globals console, process */
var WebSocketServer = require('ws').Server;
var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var AdminServer = require('./server/AdminServer');
var StoxServer = require('./server/StoxServer');

app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);


/* Websocket server */
// TODO rename stoxWss. Also path to /stox. Also StatusSocket to StoxSocket
// TODO inheritance or util for shared functions in StoxSocket and AdminSocket (bindOpen/bindClose)
var stoxWss = new WebSocketServer({server: server, path: '/stox'});
console.log('websocket server created');

var adminWss = new WebSocketServer({server: server, path: '/admin'});
console.log('adminWss websocket server created');

// TODO rename identify
// function createNewClient(ws) {
//     var newestSocketIndex = clientWss.clients.length - 1;
//     var newestSocketInfo = clientWss.clients[newestSocketIndex]._socket;
//     var msg = {
//         action: 'identify',
//         //data: '1234', // wss.clients[0]
//         ip: newestSocketInfo.remoteAddress,
//         port: newestSocketInfo.remotePort
//     };
//     console.log(newestSocketInfo.address().address + ' ' +
//         newestSocketInfo.address().port + ' ' +
//         newestSocketInfo.remoteAddress + ' ' +
//         newestSocketInfo.remotePort);
//     ws.send(JSON.stringify(msg));
// }

var adminServer = new AdminServer(adminWss);
//console.log(adminServer);

// clientWss.on('connection', function(ws) {
//     // var id = setInterval(function() {
//     //     ws.send(JSON.stringify(new Date()), function() {  });
//     // }, 50000);

//     console.log('websocket connection open');

//     ws.on('open', function() {
// 	    console.log('websocket connection open2');
//         //ws.send('test open2');
//     });

//     ws.on('close', function() {
//         //ws.send('test close');
//         console.log('websocket connection close');
//         //clearInterval(id);
//     });

//     createNewClient(ws);
//     //updateAdmins();
//     //console.log('client connection send update to adminserver ' + this.clients.length, this.clients);
//     adminServer.update(this.clients);
// });
new StoxServer(stoxWss, adminServer);
