function Arrow(fromX, fromY, toX, toY, direction, headSize) {
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
    this.direction = direction;
    this.headSize = headSize;
}

if (typeof module != 'undefined') {
    module.exports = Arrow;
}