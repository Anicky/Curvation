var Canvas = function () {
    this.width = 0;
    this.height = 0;
    this.context = null;

    var init = function () {
        this.clear();
    };

    var clear = function () {
        this.context.clearRect(0, 0, this.width, this.height);
    };

    var draw = function (game, interpolationPercentage) {
        this.clear();
        // @TODO : not drawing players but entities
        for (var i = 0; i < game.players.length; i++) {
            game.players[i].draw(this, interpolationPercentage);
        }
    };

    var drawArrow = function (fromX, fromY, toX, toY, arrowHeadSize, color) {
        var dX = toX - fromX;
        var dY = toY - fromY;
        var angle = Math.atan2(dY, dX);
        this.context.strokeStyle = color;
        this.context.beginPath();
        this.context.moveTo(fromX, fromY);
        this.context.lineTo(toX, toY);
        this.context.lineTo(toX - arrowHeadSize * Math.cos(angle - Math.PI / 6), toY - arrowHeadSize * Math.sin(angle - Math.PI / 6));
        this.context.moveTo(toX, toY);
        this.context.lineTo(toX - arrowHeadSize * Math.cos(angle + Math.PI / 6), toY - arrowHeadSize * Math.sin(angle + Math.PI / 6));
        this.context.stroke();
    };

    return {
        width: this.width,
        height: this.height,
        context: this.context,
        init: init,
        clear: clear,
        draw: draw,
        drawArrow: drawArrow
    };
};

if (typeof exports != 'undefined') {
    exports.Canvas = Canvas;
}
