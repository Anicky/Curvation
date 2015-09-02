var Point = function(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    var draw = function () {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.fill();
    };

    return {
        x: this.x,
        y: this.y,
        size: this.size,
        draw: draw
    };
};

if (typeof exports != 'undefined') {
    exports.Point = Point;
}