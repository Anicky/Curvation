function Player(name, color) {
    this.name = name;
    this.color = color;
    this.init();
}

Player.prototype.init = function () {
    this.x = setRandomX();
    this.y = setRandomY();
    this.direction = 1;
    this.speed = DEFAULT_SNAKE_SPEED;
    this.size = DEFAULT_SNAKE_SIZE;
    this.curve = DEFAULT_SNAKE_CURVE;
    this.holeSize = DEFAULT_SNAKE_HOLE_SIZE;
    this.holeMinimumTime = DEFAULT_SNAKE_HOLE_MINIMUM_TIME;
    this.holeProbability = DEFAULT_SNAKE_HOLE_PROBABILITY;
    this.holeTimer = 0;
    this.currentHole = false;
}