function Player(name, color) {
    this.name = name;
    this.color = color;
    this.init();
}

Player.prototype.init = function () {
    this.keyPressedLeft = 0;
    this.keyPressedRight = 0;
    this.x = setRandomX();
    this.y = setRandomY();
    this.lastX = this.x;
    this.lastY = this.y;
    this.direction = setRandomAngle();
    this.speed = DEFAULT_SNAKE_SPEED;
    this.size = DEFAULT_SNAKE_SIZE;
    this.curve = DEFAULT_SNAKE_CURVE;
    this.holeSize = 0;
    this.holeProbability = DEFAULT_SNAKE_HOLE_PROBABILITY;
    this.holeTimer = 0;
    this.currentHole = false;
    this.collisionsCheck = false;
}

Player.prototype.update = function (delta) {
    if (noCollisionsTimer >= DEFAULT_NO_COLLISIONS_TIME) {
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
    this.lastX = this.x;
    this.lastY = this.y;
    this.x += Math.cos(this.direction) * (this.speed * delta);
    this.y += Math.sin(this.direction) * (this.speed * delta);
    var tempX = this.x;
    var tempY = this.y;
    checkKey(this);
    tempX += Math.cos(this.direction) * this.size;
    tempY += Math.sin(this.direction) * this.size;
    if (noCollisionsTimer < DEFAULT_NO_COLLISIONS_TIME) {
        noCollisionsTimer++;
    } else if (!this.currentHole) {
        this.collisionsCheck = this.checkCollisions(tempX, tempY);
    }
};

Player.prototype.draw = function (interpolationPercentage) {
    if (!this.currentHole) {
        var x = this.lastX + (this.x - this.lastX) * interpolationPercentage;
        var y = this.lastY + (this.y - this.lastY) * interpolationPercentage;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(x, y, this.size, 0, 2 * Math.PI);
        context.fill();
    }
};

Player.prototype.checkCollisions = function (tempX, tempY) {
    var pixelData = context.getImageData(tempX, tempY, 1, 1);
    if (this.x <= 0 || this.x >= canvas.width || this.y <= 0 || this.y >= canvas.height || (pixelData.data[3] > 0)) {
        return true;
    }
    return false;
}