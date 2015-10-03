function Player(game, name, color, id) {
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

Player.prototype.init = function () {
    this.keyPressedLeft = 0;
    this.keyPressedRight = 0;
    this.speed = DEFAULT_SNAKE_SPEED;
    this.size = DEFAULT_SNAKE_SIZE;
    this.curve = DEFAULT_SNAKE_CURVE;
    this.holeSize = 0;
    this.holeProbability = DEFAULT_SNAKE_HOLE_PROBABILITY;
    this.holeTimer = 0;
    this.currentHole = false;
    this.collisionsCheck = false;
    this.history = [];
};

Player.prototype.setRandomPosition = function () {
    this.x = round(setRandomX(), 1);
    this.y = round(setRandomY(), 1);
    this.direction = setRandomAngle();
};

Player.prototype.createHole = function () {
    this.holeSize = setRandomHoleSize();
    this.currentHole = true;
    this.holeTimer = 0;
};

Player.prototype.stopHole = function () {
    this.holeTimer = 0;
    this.currentHole = false;
};

Player.prototype.handleHole = function () {
    if (this.game.timer >= DEFAULT_WAITING_TIME + DEFAULT_NO_COLLISIONS_TIME) {
        if (this.currentHole) {
            this.holeTimer++;
            if (this.holeTimer > this.holeSize) {
                this.stopHole();
            }
        } else if (this.holeTimer > DEFAULT_SNAKE_HOLE_MINIMUM_TIME) {
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

Player.prototype.update = function (delta) {
    if (this.game.mode === GAME_MODE_LOCAL) {
        this.handleHole();
    }
    if (this.currentHole || (this.game.timer < DEFAULT_WAITING_TIME + DEFAULT_NO_COLLISIONS_TIME)) {
        this.history.pop();
    }
    this.history.push(new Point(this.x, this.y, this.size));
    if (this.game.timer >= DEFAULT_WAITING_TIME) {
        this.collisionsCheck = this.checkCollisions();
        if (!this.collisionsCheck) {
            this.movePlayer(delta);
        }
    }
};

Player.prototype.movePlayer = function (delta) {
    this.x = round(this.x + (Math.cos(this.direction) * (this.speed * delta)), 1);
    this.y = round(this.y + (Math.sin(this.direction) * (this.speed * delta)), 1);
    this.changeDirection();
};

Player.prototype.draw = function (timer) {
    this.game.drawer.drawHistory(this.history, this.color);
    if (timer < DEFAULT_WAITING_TIME) {
        this.game.drawer.drawArrow(this.getArrow(), this.color);
    }
};

Player.prototype.getArrow = function () {
    var fromX = this.x + Math.cos(this.direction) * (DEFAULT_SNAKE_ARROW_SPACE + this.size);
    var fromY = this.y + Math.sin(this.direction) * (DEFAULT_SNAKE_ARROW_SPACE + this.size);
    var toX = this.x + Math.cos(this.direction) * (DEFAULT_SNAKE_ARROW_SIZE + DEFAULT_SNAKE_ARROW_SPACE + this.size);
    var toY = this.y + Math.sin(this.direction) * (DEFAULT_SNAKE_ARROW_SIZE + DEFAULT_SNAKE_ARROW_SPACE + this.size);
    return new Arrow(fromX, fromY, toX, toY, this.direction, DEFAULT_SNAKE_ARROW_HEADSIZE, this.size);
};

Player.prototype.checkCollisions = function () {
    /**
     * @TODO : Detection de collisions a revoir pour se passer du canvas.
     * Comparer la tete du snake avec toutes les entites du jeu.
     * En cas de problemes de performance, utiliser un Quadtree
     * Voir ici pour l'explication : http://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374
     * Et ici pour la demo : http://www.mikechambers.com/blog/2011/03/21/javascript-quadtree-implementation/
     */
    if (!this.currentHole && this.game.timer >= DEFAULT_WAITING_TIME + DEFAULT_NO_COLLISIONS_TIME) {
        if (this.checkCollisionsWithItems() || this.checkCollisionsWithBorders() || this.checkCollisionsWithItself() || this.checkCollisionsWithOthers()) {
            return true;
        }
    }
};

Player.prototype.checkCollisionsWithItems = function () {
    // @TODO
    return false;
};

Player.prototype.checkCollisionsWithBorders = function () {
    if (((this.x - this.size) <= 0) || ((this.x + this.size) >= 1000) || ((this.y - this.size) <= 0) || ((this.y + this.size) >= 1000)) {
        return true;
    }
    return false;
};

Player.prototype.checkCollisionsWithItself = function () {
    var lastPointToCheck = round(this.history.length - (5 + (this.size * 3) - (this.speed * 10)), 0);
    for (var i = 0; i < lastPointToCheck; i++) {
        if (this.collidesWith(this.history[i])) {
            return true;
        }
    }
};

Player.prototype.checkCollisionsWithOthers = function () {
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

Player.prototype.collidesWith = function (point) {
    var dx = this.x - point.x;
    var dy = this.y - point.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.size + point.size) {
        return true;
    }
    return false;
};

Player.prototype.changeDirection = function () {
    if (this.keyPressedLeft) {
        this.direction -= this.curve * (Math.PI / 180);
    }
    else if (this.keyPressedRight) {
        this.direction += this.curve * (Math.PI / 180);
    }
};

Player.prototype.checkKey = function (actualKeyCode, availableKeyCodes, keyPressed) {
    if (actualKeyCode == availableKeyCodes[0]) {
        this.keyPressedLeft = keyPressed;
    }
    if (actualKeyCode == availableKeyCodes[1]) {
        this.keyPressedRight = keyPressed;
    }
};

if (typeof module != 'undefined') {
    module.exports = Player;
}
if (typeof require != 'undefined') {
    var Point = require("./Point");
}
if (typeof require != 'undefined') {
    var Arrow = require("./Arrow");
}