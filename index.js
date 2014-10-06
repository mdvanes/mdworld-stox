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
var stoxWss = new WebSocketServer({server: server, path: '/stox'});
console.log('websocket server created');

var adminWss = new WebSocketServer({server: server, path: '/admin'});
console.log('adminWss websocket server created');

var adminServer = new AdminServer(adminWss, stoxWss);
new StoxServer(stoxWss, adminServer);
