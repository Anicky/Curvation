/**
 * Class Point
 * @param {number} x
 * @param {number} y
 * @param {number} size
 * @constructor
 */
var Point = function (x, y, size) {
    /* private attribute */
    if (typeof x !== 'number') {
        throw new TypeError('Point constructor : The attribute x must be a number.');
    } else if (typeof y !== 'number') {
        throw new TypeError('Point constructor : The attribute y must be a number.');
    } else if (typeof size !== 'number') {
        throw new TypeError('Point constructor : The attribute size must be a number.');
    }
    var _x = x;
    var _y = y;
    var _size = size;

    /**
     * Define getter and setter for _x private attribute
     */
    Object.defineProperties(this, {
        "x": {
            // canvas.size
            get: function () { return _x; },
            // canvas.size = ...
            set: function(x) {
                if (typeof x !== 'number') {
                    throw new TypeError('Point constructor : The attribute x must be a number.');
                }
                _x = x;
            },
            enumerable: true
        }
    });

    /**
     * Define getter and setter for _y private attribute
     */
    Object.defineProperties(this, {
        "y": {
            // canvas.size
            get: function () { return _y; },
            // canvas.size = ...
            set: function(y) {
                if (typeof y !== 'number') {
                    throw new TypeError('Point constructor : The attribute y must be a number.');
                }
                _y = y;
            },
            enumerable: true
        }
    });

    /**
     * Define getter and setter for _size private attribute
     */
    Object.defineProperties(this, {
        "size": {
            // canvas.size
            get: function () { return _size; },
            // canvas.size = ...
            set: function(size) {
                if (typeof size !== 'number') {
                    throw new TypeError('Point constructor : The attribute size must be a number.');
                }
                _size = size;
            },
            enumerable: true
        }
    });
};

if (typeof module != 'undefined') {
    module.exports = Point;
}