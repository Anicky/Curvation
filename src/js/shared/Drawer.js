/**
 * Build an interface for all drawer classes
 * @type {{init: Function, preprocess: Function, drawPoint: Function, drawArrow: Function, drawCurve: Function, postprocess: Function}}
 */
var Drawer = {
    /**
     * Initialize the drawer
     */
    init: function(){},
    /**
     * Define preliminary process executed before drawing
     */
    preprocess: function(){},
    /**
     * Draw a point
     */
    drawPoint : function(player){},
    /**
     * Draw an arrow
     */
    drawArrow : function(id){},
    /**
     * Draw a curve
     */
    drawCurve:function(id){},
    /**
     * Define process executed after drawing
     */
    postprocess: function() {}
};