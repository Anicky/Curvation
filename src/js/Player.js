function Player(name, color) {
    this.name = name;
    this.color = color;
    this.score = 0;
    this.init();
}

Player.prototype.init = function () {
    this.keyPressedLeft = 0;
    this.keyPressedRight = 0;
    this.x = setRandomX();
    this.y = setRandomY();
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
    if (timer >= DEFAULT_WAITING_TIME + DEFAULT_NO_COLLISIONS_TIME) {
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
    if (this.currentHole || (timer < DEFAULT_WAITING_TIME + DEFAULT_NO_COLLISIONS_TIME)) {
        this.history.pop();
    }
    this.history.push(new Point(this.x, this.y, this.size));
    if (timer >= DEFAULT_WAITING_TIME) {
        this.x += Math.cos(this.direction) * (this.speed * delta);
        this.y += Math.sin(this.direction) * (this.speed * delta);
        var tempX = this.x;
        var tempY = this.y;
        this.changeDirection();
        tempX += Math.cos(this.direction) * this.size;
        tempY += Math.sin(this.direction) * this.size;
        if (!this.currentHole) {
            this.collisionsCheck = this.checkCollisions(tempX, tempY);
        }
    }
    timer++;
};

Player.prototype.draw = function (interpolationPercentage) {
    context.fillStyle = this.color;
    for (var i = 0; i < this.history.length; i++) {
        this.history[i].draw();
    }
};

Player.prototype.checkCollisions = function (tempX, tempY) {
    var pixelData = context.getImageData(tempX, tempY, 1, 1);
    if (this.x <= 0 || this.x >= canvas.width || this.y <= 0 || this.y >= canvas.height || (pixelData.data[3] > 0)) {
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
