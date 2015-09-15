function CanvasDisplay() {
    this.width = 0;
    this.height = 0;
    this.context = null;
}

CanvasDisplay.prototype.init = function () {
    this.clear();
};

CanvasDisplay.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
};

CanvasDisplay.prototype.draw = function (entities) {
    this.clear();
    for (var i = 0; i < entities.length; i++) {
        if ((entities[i]) instanceof Point) {
            this.drawPoint(entities[i]);
        } else if ((entities[i]) instanceof Arrow) {
            this.drawArrow(entities[i]);
        }
    }
};

CanvasDisplay.prototype.drawPoint = function (entity) {
    this.context.fillStyle = entity.color;
    this.context.beginPath();
    this.context.arc(entity.x, entity.y, entity.size, 0, 2 * Math.PI);
    this.context.fill();
};

CanvasDisplay.prototype.drawArrow = function (entity) {
    var dX = entity.toX - entity.fromX;
    var dY = entity.toY - entity.fromY;
    var angle = Math.atan2(dY, dX);
    this.context.strokeStyle = entity.color;
    this.context.beginPath();
    this.context.moveTo(entity.fromX, entity.fromY);
    this.context.lineTo(entity.toX, entity.toY);
    this.context.lineTo(entity.toX - entity.headSize * Math.cos(angle - Math.PI / 6), entity.toY - entity.headSize * Math.sin(angle - Math.PI / 6));
    this.context.moveTo(entity.toX, entity.toY);
    this.context.lineTo(entity.toX - entity.headSize * Math.cos(angle + Math.PI / 6), entity.toY - entity.headSize * Math.sin(angle + Math.PI / 6));
    this.context.stroke();
};

if (typeof module != 'undefined') {
    module.exports = CanvasDisplay;
}