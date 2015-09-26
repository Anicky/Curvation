function Arrow(fromX, fromY, toX, toY, direction, headSize, color) {
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
    this.direction = direction;
    this.headSize = headSize;
    this.color = color;
    this.type = 'Arrow';
}

if (typeof module != 'undefined') {
    module.exports = Arrow;
}