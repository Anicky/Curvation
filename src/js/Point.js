function Point(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
}

Point.prototype.draw = function () {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    context.fill();
};

if (typeof exports != 'undefined') {
    exports.Point = Point;
}