const KEY_LEFT = 37;
const KEY_RIGHT = 39;

const DEFAULT_SNAKE_SIZE = 3;
const DEFAULT_SNAKE_SPEED = 2;
const DEFAULT_SNAKE_CURVE = 3;

const DEFAULT_BEGIN_PADDING = 30;

var players = new Array();
var canvas = null;
var context = null;
var keyPressedLeft = 0;
var keyPressedRight = 0;
var gameRunning = true;

function Player(name, color, x, y) {
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    this.direction = 1;
    this.speed = DEFAULT_SNAKE_SPEED;
    this.size = DEFAULT_SNAKE_SIZE;
}

function updateCanvas() {
    var collisionsCheck = false;
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        var dX = Math.cos(p.direction) * DEFAULT_SNAKE_SPEED;
        var dY = Math.sin(p.direction) * DEFAULT_SNAKE_SPEED;
        p.x += dX;
        p.y += dY;
        var tempX = p.x;
        var tempY = p.y;
        checkKey();
        tempX += Math.cos(p.direction) * DEFAULT_SNAKE_SIZE;
        tempY += Math.sin(p.direction) * DEFAULT_SNAKE_SIZE;
        context.fillStyle = p.color;
        collisionsCheck = checkCollisions(p, tempX, tempY);
        context.beginPath();
        context.arc(p.x, p.y, DEFAULT_SNAKE_SIZE, 0, 2 * Math.PI);
        context.fill();
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

$(document).ready(function () {
    canvas = document.getElementById('game');
    canvas.width = $('.panel-body').width();
	canvas.height = $('.panel-body').height();
    context = canvas.getContext("2d");
	
	// Position aléatoire
	randomX = Math.floor(Math.random() * (canvas.width - DEFAULT_BEGIN_PADDING * 2)) + DEFAULT_BEGIN_PADDING;
	randomY = Math.floor(Math.random() * (canvas.height - DEFAULT_BEGIN_PADDING * 2)) + DEFAULT_BEGIN_PADDING;
	
    players.push(new Player("Jérémie", 'pink', randomX, randomY));
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
    refresh();
    $('#retry').click(function () {
        retry();
    });
});

function retry() {
    $('#gameover').modal('hide');
    context.clearRect(0, 0, canvas.width, canvas.height);
	// Position aléatoire
	randomX = Math.floor(Math.random() * (canvas.width - DEFAULT_BEGIN_PADDING * 2)) + DEFAULT_BEGIN_PADDING;
	randomY = Math.floor(Math.random() * (canvas.height - DEFAULT_BEGIN_PADDING * 2)) + DEFAULT_BEGIN_PADDING;
    players[0].x = randomX;
    players[0].y = randomY;
    players[0].direction = 1;
    gameRunning = true;
    refresh();
}


function checkKey() {
    if (keyPressedLeft) {
        players[0].direction -= DEFAULT_SNAKE_CURVE * (Math.PI / 180);
    }
    else if (keyPressedRight) {
        players[0].direction += DEFAULT_SNAKE_CURVE * (Math.PI / 180);
    }
}
