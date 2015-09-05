function Point(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
}

if (typeof module != 'undefined') {
    module.exports = Point;
}