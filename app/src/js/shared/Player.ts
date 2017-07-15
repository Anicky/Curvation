import Point = require('./Point');
import Arrow = require('./Arrow');
import Tools = require('./Tools');

class Player {

    public x;
    public y;
    public direction;
    public name;
    public color;
    public score;
    public id;
    public game;
    public keyPressedLeft;
    public keyPressedRight;
    public speed;
    public size;
    public curve;
    public holeSize;
    public holeProbability;
    public holeTimer;
    public currentHole;
    public collisionsCheck;
    public history;

    constructor(game, name, color, id) {
        this.x = 0;
        this.y = 0;
        this.direction = 0;
        this.name = name;
        this.color = color;
        this.score = 0;
        if (id === undefined) {
            this.id = this.name;
        } else {
            this.id = id;
        }
        this.game = game;
    }

    public init() {
        this.keyPressedLeft = 0;
        this.keyPressedRight = 0;
        this.speed = Tools.DEFAULT_SNAKE_SPEED;
        this.size = Tools.DEFAULT_SNAKE_SIZE;
        this.curve = Tools.DEFAULT_SNAKE_CURVE;
        this.holeSize = 0;
        this.holeProbability = Tools.DEFAULT_SNAKE_HOLE_PROBABILITY;
        this.holeTimer = 0;
        this.currentHole = false;
        this.collisionsCheck = false;
        this.history = [];
    };

    public setRandomPosition() {
        this.x = Tools.round(Tools.setRandomX(), 1);
        this.y = Tools.round(Tools.setRandomY(), 1);
        this.direction = Tools.setRandomAngle();
    };

    public createHole() {
        this.holeSize = Tools.setRandomHoleSize();
        this.currentHole = true;
        this.holeTimer = 0;
    };

    public stopHole() {
        this.holeTimer = 0;
        this.currentHole = false;
    };

    public handleHole() {
        if (this.game.timer >= Tools.DEFAULT_WAITING_TIME + Tools.DEFAULT_NO_COLLISIONS_TIME) {
            if (this.currentHole) {
                this.holeTimer++;
                if (this.holeTimer > this.holeSize) {
                    this.stopHole();
                }
            } else if (this.holeTimer > Tools.DEFAULT_SNAKE_HOLE_MINIMUM_TIME) {
                var holeProbability = Math.random() * 100;
                if (holeProbability <= this.holeProbability) {
                    this.createHole();
                } else {
                    this.holeTimer++;
                }
            } else {
                this.holeTimer++;
            }
        }
    };

    public update(delta) {
        if (this.game.mode === Tools.GAME_MODE_LOCAL) {
            this.handleHole();
        }
        if (this.currentHole || (this.game.timer < Tools.DEFAULT_WAITING_TIME + Tools.DEFAULT_NO_COLLISIONS_TIME)) {
            this.history.pop();
        }
        this.history.push(new Point(this.x, this.y, this.size));
        if (this.game.timer >= Tools.DEFAULT_WAITING_TIME) {
            this.collisionsCheck = this.checkCollisions();
            if (!this.collisionsCheck) {
                this.movePlayer(delta);
            }
        }
    };

    public movePlayer(delta) {
        this.x = Tools.round(this.x + (Math.cos(this.direction) * (this.speed * (delta / this.game.frametimeMax))), 1);
        this.y = Tools.round(this.y + (Math.sin(this.direction) * (this.speed * (delta / this.game.frametimeMax))), 1);
        this.changeDirection(delta);
    };

    public draw(timer) {
        this.game.drawer.drawCurve(this.history, this.color);
        if ((timer < Tools.DEFAULT_WAITING_TIME) && ((this.game.mode === Tools.GAME_MODE_LOCAL) || (this.game.mode === Tools.GAME_MODE_ONLINE) && (this.game.currentPlayerId === this.id))) {
            this.game.drawer.drawArrow(this.getArrow(), this.color);
        }
    };

    public getArrow() {
        var fromX = this.x + Math.cos(this.direction) * (Tools.DEFAULT_SNAKE_ARROW_SPACE + this.size);
        var fromY = this.y + Math.sin(this.direction) * (Tools.DEFAULT_SNAKE_ARROW_SPACE + this.size);
        var toX = this.x + Math.cos(this.direction) * (Tools.DEFAULT_SNAKE_ARROW_SIZE + Tools.DEFAULT_SNAKE_ARROW_SPACE + this.size);
        var toY = this.y + Math.sin(this.direction) * (Tools.DEFAULT_SNAKE_ARROW_SIZE + Tools.DEFAULT_SNAKE_ARROW_SPACE + this.size);
        return new Arrow(fromX, fromY, toX, toY, this.direction, Tools.DEFAULT_SNAKE_ARROW_HEADSIZE, this.size);
    };

    public checkCollisions() {
        /**
         * Comparer la tete du snake avec toutes les entites du jeu.
         * En cas de problemes de performance, utiliser un Quadtree
         * Voir ici pour l'explication : http://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374
         * Et ici pour la demo : http://www.mikechambers.com/blog/2011/03/21/javascript-quadtree-implementation/
         */
        if ((!this.currentHole) && (this.game.timer >= (Tools.DEFAULT_WAITING_TIME + Tools.DEFAULT_NO_COLLISIONS_TIME))) {
            if (this.checkCollisionsWithItems() || this.checkCollisionsWithBorders() || this.checkCollisionsWithItself() || this.checkCollisionsWithOthers()) {
                return true;
            }
        }
    };

    public checkCollisionsWithItems() {
        // @TODO
        return false;
    };

    public checkCollisionsWithBorders() {
        if (((this.x - this.size) <= 0) || ((this.x + this.size) >= Tools.MAP_SIZE) || ((this.y - this.size) <= 0) || ((this.y + this.size) >= Tools.MAP_SIZE)) {
            return true;
        }
        return false;
    };

    public checkCollisionsWithItself() {
        var lastPointToCheck = Tools.round(this.history.length - (5 + (this.size * 3) - (this.speed * 100)), 0);
        if (this.history.length > lastPointToCheck) {
            for (var i = 0; i < lastPointToCheck; i++) {
                if (this.collidesWith(this.history[i])) {
                    return true;
                }
            }
        }
    };

    public checkCollisionsWithOthers() {
        var players = this.game.players;
        for (var i = 0; i < players.length; i++) {
            if (players[i].id !== this.id) {
                for (var j = 0; j < players[i].history.length; j++) {
                    var point = players[i].history[j];
                    if (this.collidesWith(point)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    public collidesWith(point) {
        var dx = this.x - point.x;
        var dy = this.y - point.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + point.size) {
            return true;
        }
        return false;
    };

    public changeDirection(delta) {
        if (this.keyPressedLeft) {
            this.direction -= (this.curve * (delta / this.game.frametimeMax)) * (Math.PI / 180);
        }
        else if (this.keyPressedRight) {
            this.direction += (this.curve * (delta / this.game.frametimeMax)) * (Math.PI / 180);
        }
    };

    public checkKey(actualKeyCode, availableKeyCodes, keyPressed) {
        if (actualKeyCode === availableKeyCodes[0]) {
            this.keyPressedLeft = keyPressed;
        }
        if (actualKeyCode === availableKeyCodes[1]) {
            this.keyPressedRight = keyPressed;
        }
    };

    public toString() {
        return this.name + ' (' + this.id + ')';
    };

}

export = Player;