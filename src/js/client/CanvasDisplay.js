CanvasDisplay.prototype = new Drawer();

function CanvasDisplay(width) {
    this.resize(width);
}

CanvasDisplay.prototype.resize = function (width) {
    this.width = width;
    this.ratio = width / 1000;
};

CanvasDisplay.prototype.init = function () {
    this.context.clearRect(0, 0, this.width, this.width);
};

CanvasDisplay.prototype.drawHistory = function (entities, color) {
    this.context.fillStyle = color;
    for (var i = 0; i < entities.length; i++) {
        this.context.beginPath();
        this.context.arc(entities[i].x * this.ratio, entities[i].y * this.ratio, entities[i].size * this.ratio, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
    }
};

CanvasDisplay.prototype.drawArrow = function (entity, color) {
    var dX = (entity.toX * this.ratio) - (entity.fromX * this.ratio);
    var dY = (entity.toY * this.ratio) - (entity.fromY * this.ratio);
    var angle = Math.atan2(dY, dX);

    this.context.strokeStyle = color;
    this.context.fillStyle = color;
    this.context.lineWidth = entity.size * this.ratio;

    this.context.beginPath();
    this.context.arc(entity.fromX * this.ratio, entity.fromY * this.ratio, entity.size / 2 * this.ratio, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();

    this.context.beginPath();
    this.context.moveTo(entity.fromX * this.ratio, entity.fromY * this.ratio);
    this.context.lineTo(entity.toX * this.ratio, entity.toY * this.ratio);
    this.context.closePath();
    this.context.stroke();

    this.context.beginPath();
    this.context.arc(entity.toX * this.ratio, entity.toY * this.ratio, entity.size / 2 * this.ratio, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();

    var toX = (entity.toX * this.ratio) - (entity.headSize * this.ratio) * Math.cos(angle - Math.PI / 6);
    var toY = (entity.toY * this.ratio) - (entity.headSize * this.ratio) * Math.sin(angle - Math.PI / 6);
    this.context.beginPath();
    this.context.moveTo(entity.toX * this.ratio, entity.toY * this.ratio);
    this.context.lineTo(toX, toY);
    this.context.closePath();
    this.context.stroke();

    this.context.beginPath();
    this.context.arc(toX, toY, (entity.size / 2) * this.ratio, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();

    toX = (entity.toX * this.ratio) - (entity.headSize * this.ratio) * Math.cos(angle + Math.PI / 6);
    toY = (entity.toY * this.ratio) - (entity.headSize * this.ratio) * Math.sin(angle + Math.PI / 6);
    this.context.beginPath();
    this.context.moveTo(entity.toX * this.ratio, entity.toY * this.ratio);
    this.context.lineTo(toX, toY);
    this.context.closePath();
    this.context.stroke();

    this.context.beginPath();
    this.context.arc(toX, toY, (entity.size / 2) * this.ratio, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
};

if (typeof module != 'undefined') {
    module.exports = CanvasDisplay;
}