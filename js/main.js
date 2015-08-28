const KEY_LEFT = 37;
const KEY_RIGHT = 39;

const DEFAULT_SNAKE_SIZE = 3;
const DEFAULT_SNAKE_SPEED = 2;
const DEFAULT_SNAKE_CURVE = 3;

const DEFAULT_BEGIN_PADDING = 30;
const DEFAULT_NO_COLLISIONS_TIME = 200;

const DEFAULT_SNAKE_HOLE_SIZE = 8;
const DEFAULT_SNAKE_HOLE_MINIMUM_TIME = 20;
const DEFAULT_SNAKE_HOLE_PROBABILITY = 0.5;

var players = new Array();
var canvas = null;
var context = null;
var keyPressedLeft = 0;
var keyPressedRight = 0;
var gameRunning = true;
var noCollisionsTimer = 0;

function updateCanvas() {
    var collisionsCheck = false;
    if (noCollisionsTimer < DEFAULT_NO_COLLISIONS_TIME) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        if (noCollisionsTimer >= DEFAULT_NO_COLLISIONS_TIME) {
            if (p.currentHole) {
                p.holeTimer++;
                if (p.holeTimer > p.holeSize) {
                    p.holeTimer = 0;
                    p.currentHole = false;
                }
            } else if (p.holeTimer > p.holeMinimumTime) {
                var holeProbability = Math.random() * 100;
                if (holeProbability < p.holeProbability) {
                    p.currentHole = true;
                    p.holeTimer = 0;
                } else {
                    p.holeTimer++;
                }
            } else {
                p.holeTimer++;
            }
        }
        p.x += Math.cos(p.direction) * p.speed;
        p.y += Math.sin(p.direction) * p.speed;
        var tempX = p.x;
        var tempY = p.y;
        checkKey();
        tempX += Math.cos(p.direction) * p.size;
        tempY += Math.sin(p.direction) * p.size;
        context.fillStyle = p.color;
        if (noCollisionsTimer < DEFAULT_NO_COLLISIONS_TIME) {
            noCollisionsTimer++;
        } else if (!p.currentHole) {
            collisionsCheck = checkCollisions(p, tempX, tempY);
        }
        if (!p.currentHole) {
            context.beginPath();
            context.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
            context.fill();
        }
    }
    if (collisionsCheck) {
        $('#gameover').modal('show');
    }
    return collisionsCheck;
}

function checkCollisions(p, tempX, tempY) {
    var pixelData = context.getImageData(tempX, tempY, 1, 1);
    if (p.x <= 0 || p.x >= canvas.width || p.y <= 0 || p.y >= canvas.height || (pixelData.data[3] > 0)) {
        return true;
    }
    return false;
}

function refresh() {
    setTimeout(function () {
        gameRunning = updateCanvas();
        if (!gameRunning) {
            refresh();
        }
    }, 10);
}

function setRandomX() {
    return Math.floor(Math.random() * (canvas.width - DEFAULT_BEGIN_PADDING * 2)) + DEFAULT_BEGIN_PADDING;
}

function setRandomY() {
    return Math.floor(Math.random() * (canvas.height - DEFAULT_BEGIN_PADDING * 2)) + DEFAULT_BEGIN_PADDING;
}

function init() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < players.length; i++) {
        players[i].init();
    }
    gameRunning = true;
    noCollisionsTimer = 0
    refresh();
}

$(document).ready(function () {
    canvas = document.getElementById('game');
    canvas.width = $('.panel-body').width();
    canvas.height = $('.panel-body').height();
    context = canvas.getContext("2d");
    players.push(new Player("Jérémie", 'pink'));
    $(this).keydown(function (e) {
        e.preventDefault();
        if (e.keyCode == KEY_LEFT) {
            keyPressedLeft = 1;
        }
        else if (e.keyCode == KEY_RIGHT) {
            keyPressedRight = 1;
        }
    });
    $(this).keyup(function (e) {
        e.preventDefault();
        if (e.keyCode == KEY_LEFT) {
            keyPressedLeft = 0;
        }
        else if (e.keyCode == KEY_RIGHT) {
            keyPressedRight = 0;
        }
    });
    $('#retry').click(function () {
        $('#gameover').modal('hide');
        init();
    });
    init();
});

function checkKey() {
    if (keyPressedLeft) {
        players[0].direction -= DEFAULT_SNAKE_CURVE * (Math.PI / 180);
    }
    else if (keyPressedRight) {
        players[0].direction += DEFAULT_SNAKE_CURVE * (Math.PI / 180);
    }
}
