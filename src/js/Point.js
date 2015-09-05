function Point(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
}

if (typeof module != 'undefined') {
    module.exports = Point;
}