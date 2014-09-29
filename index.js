var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/"));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({server: server});
console.log("websocket server created");

wss.on("connection", function(ws) {
    // var id = setInterval(function() {
    //     ws.send(JSON.stringify(new Date()), function() {  });
    // }, 50000);

    console.log("websocket connection open");

    ws.on('open', function() {
	    console.log('websocket connection open2');
        //ws.send('test open2');
    });

    ws.on("close", function() {
        //ws.send('test close');
        console.log("websocket connection close");
        //clearInterval(id);
    });

    createNewClient(ws);
    updateAdmins();
});

wss.broadcast = function(data) {
    for (var i in this.clients) {
        this.clients[i].send(data);
    }
};

function createNewClient(ws) {
    var newestSocketIndex = wss.clients.length - 1;
    var newestSocketInfo = wss.clients[newestSocketIndex]._socket;
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
}

function updateAdmins() {
    // TODO better way of identifying admins

    var clientlist = [];
    for (var i = 0; i < wss.clients.length; i++) {
        var port = wss.clients[i]._socket.remotePort;
        clientlist.push(port);
    }

    var msg = {
        action: 'adminUpdate',
        clients: clientlist
    };

    wss.broadcast(JSON.stringify(msg));
}
