import Drawer = require('../shared/Drawer');
import Tools = require('../shared/Tools');

class CanvasDisplay implements Drawer {
    public size: number;
    public context;

    constructor(size: number, context) {
        this.size = size;
        this.context = context;
    }

    public getRatio() {
        return this.size / Tools.MAP_SIZE;
    }

    public init() {
        this.preprocess();
    }

    public preprocess() {
        this.clear();
    }

    /**
     * Draw a point
     */
    public drawPoint(entity) {
        this.context.fillStyle = entity.color;
        this.context.beginPath();
        this.context.arc(entity.x * this.getRatio(), entity.y * this.getRatio(), entity.size * this.getRatio(), 0, 2 * Math.PI);
        this.context.fill();
    };

    /**
     * Draw an arrow
     */
    public drawArrow(entity, color) {
        var dX = (entity.toX * this.getRatio()) - (entity.fromX * this.getRatio());
        var dY = (entity.toY * this.getRatio()) - (entity.fromY * this.getRatio());
        var angle = Math.atan2(dY, dX);

        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.lineWidth = entity.size * this.getRatio();

        this.context.beginPath();
        this.context.arc(entity.fromX * this.getRatio(), entity.fromY * this.getRatio(), entity.size / 2 * this.getRatio(), 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();

        this.context.beginPath();
        this.context.moveTo(entity.fromX * this.getRatio(), entity.fromY * this.getRatio());
        this.context.lineTo(entity.toX * this.getRatio(), entity.toY * this.getRatio());
        this.context.closePath();
        this.context.stroke();

        this.context.beginPath();
        this.context.arc(entity.toX * this.getRatio(), entity.toY * this.getRatio(), entity.size / 2 * this.getRatio(), 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();

        var toX = (entity.toX * this.getRatio()) - (entity.headSize * this.getRatio()) * Math.cos(angle - Math.PI / 6);
        var toY = (entity.toY * this.getRatio()) - (entity.headSize * this.getRatio()) * Math.sin(angle - Math.PI / 6);
        this.context.beginPath();
        this.context.moveTo(entity.toX * this.getRatio(), entity.toY * this.getRatio());
        this.context.lineTo(toX, toY);
        this.context.closePath();
        this.context.stroke();

        this.context.beginPath();
        this.context.arc(toX, toY, (entity.size / 2) * this.getRatio(), 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();

        toX = (entity.toX * this.getRatio()) - (entity.headSize * this.getRatio()) * Math.cos(angle + Math.PI / 6);
        toY = (entity.toY * this.getRatio()) - (entity.headSize * this.getRatio()) * Math.sin(angle + Math.PI / 6);
        this.context.beginPath();
        this.context.moveTo(entity.toX * this.getRatio(), entity.toY * this.getRatio());
        this.context.lineTo(toX, toY);
        this.context.closePath();
        this.context.stroke();

        this.context.beginPath();
        this.context.arc(toX, toY, (entity.size / 2) * this.getRatio(), 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();
    };

    /**
     * Draw a curve
     */
    public drawCurve(entities, color) {
        this.context.fillStyle = color;
        for (var i = 0; i < entities.length; i++) {
            this.context.beginPath();
            this.context.arc(entities[i].x * this.getRatio(), entities[i].y * this.getRatio(), entities[i].size * this.getRatio(), 0, 2 * Math.PI);
            this.context.closePath();
            this.context.fill();
        }
    };

    /**
     * Define process executed after drawing
     */
    public postprocess() {
    };

    /**
     * Clear the context
     */
    public clear() {
        this.context.clearRect(0, 0, this.size, this.size);
    };

}

export = CanvasDisplay;