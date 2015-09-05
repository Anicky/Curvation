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
        if ((entities[i]) instanceof PlayerEntity) {
            if ((entities[i].element) instanceof Point) {
                this.drawPoint(entities[i]);
            } else if ((entities[i].element) instanceof Arrow) {
                this.drawArrow(entities[i]);
            }
        }
    }
};

Canvas.prototype.drawPoint = function (entity) {
    this.context.fillStyle = entity.color;
    this.context.beginPath();
    this.context.arc(entity.element.x, entity.element.y, entity.element.size, 0, 2 * Math.PI);
    this.context.fill();
};

Canvas.prototype.drawArrow = function (entity) {
    var dX = entity.element.toX - entity.element.fromX;
    var dY = entity.element.toY - entity.element.fromY;
    var angle = Math.atan2(dY, dX);
    this.context.strokeStyle = entity.color;
    this.context.beginPath();
    this.context.moveTo(entity.element.fromX, entity.element.fromY);
    this.context.lineTo(entity.element.toX, entity.element.toY);
    this.context.lineTo(entity.element.toX - entity.element.headSize * Math.cos(angle - Math.PI / 6), entity.element.toY - entity.element.headSize * Math.sin(angle - Math.PI / 6));
    this.context.moveTo(entity.element.toX, entity.element.toY);
    this.context.lineTo(entity.element.toX - entity.element.headSize * Math.cos(angle + Math.PI / 6), entity.element.toY - entity.element.headSize * Math.sin(angle + Math.PI / 6));
    this.context.stroke();
};

if (typeof module != 'undefined') {
    module.exports = Canvas;
}