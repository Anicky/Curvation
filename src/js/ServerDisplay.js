function ServerDisplay(width, height) {
    this.width = width;
    this.height = height;
}

ServerDisplay.prototype.init = function () {};

ServerDisplay.prototype.clear = function () {};

ServerDisplay.prototype.draw = function (entities) {};

ServerDisplay.prototype.drawPoint = function (entity) {};

ServerDisplay.prototype.drawArrow = function (entity) {};

if (typeof module != 'undefined') {
    module.exports = ServerDisplay;
}