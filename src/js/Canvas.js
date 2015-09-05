function Canvas() {
    this.width = 0;
    this.height = 0;
    this.context = null;
}

Canvas.prototype.init = function () {
    this.clear();
};

Canvas.prototype.clear = function () {
    this.context.clearRect(0, 0, this.width, this.height);
};

Canvas.prototype.draw = function (entities) {
    this.clear();
    for (var i = 0; i < entities.length; i++) {
        if ((entities[i]) instanceof PlayerPoint) {
            this.drawPoint(entities[i]);
        }
    }
};

Canvas.prototype.drawPoint = function (entity) {
    this.context.fillStyle = entity.color;
    this.context.beginPath();
    this.context.arc(entity.point.x, entity.point.y, entity.point.size, 0, 2 * Math.PI);
    this.context.fill();
};

Canvas.prototype.drawArrow = function (fromX, fromY, toX, toY, arrowHeadSize, color) {
    var dX = toX - fromX;
    var dY = toY - fromY;
    var angle = Math.atan2(dY, dX);
    this.context.strokeStyle = color;
    this.context.beginPath();
    this.context.moveTo(fromX, fromY);
    this.context.lineTo(toX, toY);
    this.context.lineTo(toX - arrowHeadSize * Math.cos(angle - Math.PI / 6), toY - arrowHeadSize * Math.sin(angle - Math.PI / 6));
    this.context.moveTo(toX, toY);
    this.context.lineTo(toX - arrowHeadSize * Math.cos(angle + Math.PI / 6), toY - arrowHeadSize * Math.sin(angle + Math.PI / 6));
    this.context.stroke();
};

if (typeof module != 'undefined') {
    module.exports = Canvas;
}