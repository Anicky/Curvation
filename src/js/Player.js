function Player(name, color, id) {
    this.name = name;
    this.color = color;
    this.score = 0;
    if (id === undefined) {
        this.id = this.name;
    } else {
        this.id = id;
    }
    this.game = null;
}

Player.prototype.init = function () {
    this.keyPressedLeft = 0;
    this.keyPressedRight = 0;
    this.x = round(setRandomX(), 1);
    this.y = round(setRandomY(), 1);
    this.direction = setRandomAngle();
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

Player.prototype.createHole = function () {
    this.holeSize = setRandomHoleSize();
    this.currentHole = true;
    this.holeTimer = 0;
};

Player.prototype.stopHole = function () {
    this.holeTimer = 0;
    this.currentHole = false;
};

Player.prototype.movePlayer = function (delta) {
    if (this.game.timer >= DEFAULT_WAITING_TIME) {
        this.x = round(this.x + (Math.cos(this.direction) * (this.speed * delta)), 1);
        this.y = round(this.y + (Math.sin(this.direction) * (this.speed * delta)), 1);
        var tempX = this.x;
        var tempY = this.y;
        this.changeDirection();
        tempX = round(tempX + (Math.cos(this.direction) * this.size), 1);
        tempY = round(tempY + (Math.sin(this.direction) * this.size), 1);
        this.collisionsCheck = this.checkCollisions(tempX, tempY);
    }
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
    this.handleHole();
    if (this.currentHole || (this.game.timer < DEFAULT_WAITING_TIME + DEFAULT_NO_COLLISIONS_TIME)) {
        this.history.pop();
    }
    this.history.push(new Point(this.x, this.y, this.size, this.color));
    this.movePlayer(delta);
};

Player.prototype.getArrow = function () {
    var fromX = this.x + Math.cos(this.direction) * (DEFAULT_SNAKE_ARROW_SPACE + this.size);
    var fromY = this.y + Math.sin(this.direction) * (DEFAULT_SNAKE_ARROW_SPACE + this.size);
    var toX = this.x + Math.cos(this.direction) * (DEFAULT_SNAKE_ARROW_SIZE + DEFAULT_SNAKE_ARROW_SPACE + this.size);
    var toY = this.y + Math.sin(this.direction) * (DEFAULT_SNAKE_ARROW_SIZE + DEFAULT_SNAKE_ARROW_SPACE + this.size);
    return new Arrow(fromX, fromY, toX, toY, this.direction, DEFAULT_SNAKE_ARROW_HEADSIZE, this.color);
};

Player.prototype.checkCollisions = function (tempX, tempY) {
    /**
     * @TODO : Detection de collisions a revoir pour se passer du canvas.
     * Comparer la tete du snake avec toutes les entites du jeu.
     * En cas de problemes de performance, utiliser un Quadtree
     * Voir ici pour l'explication : http://gamedevelopment.tutsplus.com/tutorials/quick-tip-use-quadtrees-to-detect-likely-collisions-in-2d-space--gamedev-374
     * Et ici pour la demo : http://www.mikechambers.com/blog/2011/03/21/javascript-quadtree-implementation/
     */
    if (!this.currentHole && this.game.timer >= DEFAULT_WAITING_TIME + DEFAULT_NO_COLLISIONS_TIME) {
        var pixelData = this.game.display.context.getImageData(tempX, tempY, 1, 1);
        if (this.x <= 0 || this.x >= this.game.display.width || this.y <= 0 || this.y >= this.game.display.height || (pixelData.data[3] > 0)) {
            return true;
        }
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