function Arrow(fromX, fromY, toX, toY, direction, headSize, size) {
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
    this.direction = direction;
    this.headSize = headSize;
    this.size = size;
}

if (typeof module != 'undefined') {
    module.exports = Arrow;
}