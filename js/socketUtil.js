(function() {
	'use strict';

	var socketUtil = {};

	socketUtil.hello = function() {
		console.warn('socketUtil: hello world!');
	};

	// TODO better way to pass self?
    socketUtil.receiveIdentify = function(self, response) {
        self.port = Number.parseInt(response.port);
        self.ip = response.ip;
        $('#clientInfo')
            .attr('title', self.ip + ':' + self.port )
            .tooltip();        
    };

    // TODO allow more than 1 message
    socketUtil.receiveNotification = function(msg) {
        //alert('received: ' + msg);
        $('.top-row > div .notifications').remove();
        $('.top-row > div').append('<div class="btn btn-default notifications" data-toggle="tooltip" data-placement="bottom">Inbox <span class="badge">1</span></div>');
        $('.top-row .notifications')
        	.attr('title', msg)
        	.tooltip();
    };

	window.socketUtil = socketUtil;

})(jQuery);