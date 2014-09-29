var pong = {};

pong.classes = {};

pong.classes.Pong = function(from, to, $elem) {
    this.$elem = $elem;
    window.console ? console.log( "Connecting from " + from + " to " + to + " with classes [" + $elem.attr('class') + "]" ) : null;
    this.init();
    this.setBindings();
}

pong.classes.Pong.prototype.init = function() {
    this.$elem.addClass( 'pong' );
    this.$elem.append( '<div id="pong"><div class="left"></div><div class="right"></div><div class="ball"></div></div>' );
}

pong.classes.Pong.prototype.destroy = function() {

}

pong.classes.Pong.prototype.setBindings = function() {
    var $elem = this.$elem;
    /*
    $elem.mousemove(function(event) {
        var pongHeight = $('#pong').height();
        var paddleHeight = $('.left').height();
        var offSet = 50;

        var paddleY = Math.round( (event.pageY  / ($(window).height() - paddleHeight) ) * pongHeight );

        //$('#pong').text( event.pageY + ' ' + (paddleY - offSet) );
        pong.util.movePaddle( 'left', paddleY );
    });
    */
    $('#pong').mousemove(function(event) {
        var pongHeight = $('#pong').height();
        var paddleHeight = $('.left').height();
        var paddleY = event.pageY - parseInt($(this).css('top'));
        if( paddleY < pongHeight - paddleHeight ) {
            pong.util.movePaddle( 'left', paddleY );
            // send new position to socket
        }
    });
}

pong.util = {};

pong.util.movePaddle = function( id, top ) {
    $('.'+id).css('top', top);
}