(function() {
    'use strict';

    var GenericSocket = function(ws) {
    	this.ws = ws;
        this.bindOpen();
        this.bindClose();
    };

    GenericSocket.prototype.bindOpen = function() {
        this.ws.onopen = function() {
            console.log('generic open');
            $('#status')
                .removeClass()
                .addClass('label label-success')
                .html('connected');
        };
    };

    GenericSocket.prototype.bindClose = function() {
        this.ws.onclose = function() {
            console.log('generic close');
            return $('#status')
                .removeClass()
                .addClass('label label-danger')
                .html('disconnected');
        };
    };

    window.GenericSocket = GenericSocket;
})();