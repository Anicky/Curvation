/**
 * Build an interface for all drawer classes
 * @type {{init: Function, preprocess: Function, drawPoint: Function, drawArrow: Function, drawCurve: Function, postprocess: Function}}
 */
var Drawer = function () {};

/**
 * Initialize the drawer
 */
Drawer.prototype.init = function () {};

/**
 * Define preliminary process executed before drawing
 */
Drawer.prototype.preprocess = function () {};

/**
 * Draw a point
 */
Drawer.prototype.drawPoint = function (entity) {};

/**
 * Draw an arrow
 */
Drawer.prototype.drawArrow = function (entity, color) {};

/**
 * Draw a curve
 */
Drawer.prototype.drawCurve = function (entities, color) {};

/**
 * Define process executed after drawing
 */
Drawer.prototype.postprocess = function () {};

if (typeof module !== 'undefined') {
    module.exports = Drawer;
}
