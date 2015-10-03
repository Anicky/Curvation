function Drawer() {}

Drawer.prototype.init = function () {};

Drawer.prototype.drawHistory = function (entities) {};

Drawer.prototype.drawArrow = function (entity) {};

if (typeof module != 'undefined') {
    module.exports = Drawer;
}