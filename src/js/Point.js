var Point = function(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;

    var draw = function (context) {
        console.log(this.color);
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.fill();
    };

    return {
        x: this.x,
        y: this.y,
        size: this.size,
        color: this.color,
        draw: draw
    };
};

if (typeof exports != 'undefined') {
    exports.Point = Point;
}