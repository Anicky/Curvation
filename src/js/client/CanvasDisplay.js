function CanvasDisplay(width) {
    this.width = width;
    this.height = width;
    this.context = null;
    this.ratio = width / 1000;
}

CanvasDisplay.prototype.resize = function (width) {
    this.width = width;
    this.height = width;
    this.ratio = width / 1000;
};

CanvasDisplay.prototype.init = function () {
    this.clear();
};

CanvasDisplay.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
};

CanvasDisplay.prototype.draw = function (entities) {
    this.clear();
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].type === 'Point') {
            this.drawPoint(entities[i]);
        } else if (entities[i].type === 'Arrow') {
            this.drawArrow(entities[i]);
        }
    }
};

CanvasDisplay.prototype.drawPoint = function (entity) {
    this.context.fillStyle = entity.color;
    this.context.beginPath();
    this.context.arc(entity.x * this.ratio, entity.y * this.ratio, entity.size * this.ratio, 0, 2 * Math.PI);
    this.context.fill();
};

CanvasDisplay.prototype.drawArrow = function (entity) {
    var dX = (entity.toX * this.ratio) - (entity.fromX * this.ratio);
    var dY = (entity.toY * this.ratio) - (entity.fromY * this.ratio);
    var angle = Math.atan2(dY, dX);
    this.context.strokeStyle = entity.color;
    this.context.beginPath();
    this.context.moveTo(entity.fromX * this.ratio, entity.fromY * this.ratio);
    this.context.lineTo(entity.toX * this.ratio, entity.toY * this.ratio);
    this.context.lineTo((entity.toX * this.ratio) - (entity.headSize * this.ratio) * Math.cos(angle - Math.PI / 6), (entity.toY * this.ratio) - (entity.headSize * this.ratio) * Math.sin(angle - Math.PI / 6));
    this.context.moveTo(entity.toX * this.ratio, entity.toY * this.ratio);
    this.context.lineTo((entity.toX * this.ratio) - (entity.headSize * this.ratio) * Math.cos(angle + Math.PI / 6), (entity.toY * this.ratio) - (entity.headSize * this.ratio) * Math.sin(angle + Math.PI / 6));
    this.context.stroke();
};

if (typeof module != 'undefined') {
    module.exports = CanvasDisplay;
}