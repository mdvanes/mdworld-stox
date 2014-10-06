(function() {
	'use strict';

	var socketUtil = {};

	socketUtil.hello = function() {
		console.warn('socketUtil: hello world!');
	};

	window.socketUtil = socketUtil;

})(jQuery);