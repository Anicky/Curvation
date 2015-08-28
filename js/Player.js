function Player(name, color) {
    this.name = name;
    this.color = color;
    this.x = 0;
    this.y = 0;
    this.direction = 1;
    this.speed = DEFAULT_SNAKE_SPEED;
    this.size = DEFAULT_SNAKE_SIZE;
    this.holeTimer = 0;
    this.currentHole = false;
}

Player.prototype.init = function () {
    this.x = setRandomX();
    this.y = setRandomY();
    this.direction = 1;
    this.currentHole = false;
    this.holeTimer = 0;
}