function Player(name, color, x, y) {
    this.name = name;
    this.color = color;
    this.score = 0;
    this.x = x;
    this.y = y;
    this.id = null;
    this.game = null;
}

Player.prototype.init = function (x, y) {
    this.keyPressedLeft = 0;
    this.keyPressedRight = 0;
    if (x === undefined) {
        this.x = setRandomX();
    }
    if (y === undefined) {
        this.y = setRandomY();
    }
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

Player.prototype.update = function (delta) {
    if (this.game.timer >= DEFAULT_WAITING_TIME + DEFAULT_NO_COLLISIONS_TIME) {
        if (this.currentHole) {
            this.holeTimer++;
            if (this.holeTimer > this.holeSize) {
                this.holeTimer = 0;
                this.currentHole = false;
            }
        } else if (this.holeTimer > DEFAULT_SNAKE_HOLE_MINIMUM_TIME) {
            var holeProbability = Math.random() * 100;
            if (holeProbability <= this.holeProbability) {
                this.holeSize = setRandomHoleSize();
                this.currentHole = true;
                this.holeTimer = 0;
            } else {
                this.holeTimer++;
            }
        } else {
            this.holeTimer++;
        }
    }
    if (this.currentHole || (this.game.timer < DEFAULT_WAITING_TIME + DEFAULT_NO_COLLISIONS_TIME)) {
        this.history.pop();
    }
    this.history.push(new Point(this.x, this.y, this.size, this.color));
    if (this.game.timer >= DEFAULT_WAITING_TIME) {
        this.x += Math.cos(this.direction) * (this.speed * delta);
        this.y += Math.sin(this.direction) * (this.speed * delta);
        var tempX = this.x;
        var tempY = this.y;
        this.changeDirection();
        tempX += Math.cos(this.direction) * this.size;
        tempY += Math.sin(this.direction) * this.size;
        if (!this.currentHole && this.game.timer >= DEFAULT_WAITING_TIME + DEFAULT_NO_COLLISIONS_TIME) {
            this.collisionsCheck = this.checkCollisions(tempX, tempY);
        }
    }
};

Player.prototype.getArrow = function () {
    var fromX = this.x + Math.cos(this.direction) * (DEFAULT_SNAKE_ARROW_SPACE + this.size);
    var fromY = this.y + Math.sin(this.direction) * (DEFAULT_SNAKE_ARROW_SPACE + this.size);
    var toX = this.x + Math.cos(this.direction) * (DEFAULT_SNAKE_ARROW_SIZE + DEFAULT_SNAKE_ARROW_SPACE + this.size);
    var toY = this.y + Math.sin(this.direction) * (DEFAULT_SNAKE_ARROW_SIZE + DEFAULT_SNAKE_ARROW_SPACE + this.size);
    return new Arrow(fromX, fromY, toX, toY, this.direction, DEFAULT_SNAKE_ARROW_HEADSIZE, this.color);
};

Player.prototype.checkCollisions = function (tempX, tempY) {
    var pixelData = this.game.display.context.getImageData(tempX, tempY, 1, 1);
    if (this.x <= 0 || this.x >= this.game.display.width || this.y <= 0 || this.y >= this.game.display.height || (pixelData.data[3] > 0)) {
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