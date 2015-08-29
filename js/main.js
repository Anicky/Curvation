const KEY_PLAYER1_LEFT = 37;
const KEY_PLAYER1_RIGHT = 39;
const KEY_PLAYER2_LEFT = 83;
const KEY_PLAYER2_RIGHT = 68;

const DEFAULT_SNAKE_SIZE = 3;
const DEFAULT_SNAKE_SPEED = 0.1;
const DEFAULT_SNAKE_CURVE = 3;

const DEFAULT_BEGIN_PADDING = 30;
const DEFAULT_NO_COLLISIONS_TIME = 200;

const DEFAULT_SNAKE_HOLE_SIZE_MIN = 8;
const DEFAULT_SNAKE_HOLE_SIZE_MAX = 16;
const DEFAULT_SNAKE_HOLE_MINIMUM_TIME = 20;
const DEFAULT_SNAKE_HOLE_PROBABILITY = 0.5;

var players = new Array();
var canvas = null;
var context = null;
var gameRunning = true;
var noCollisionsTimer = 0;

function setRandomX() {
    return Math.floor(Math.random() * (canvas.width - DEFAULT_BEGIN_PADDING * 2 + 1)) + DEFAULT_BEGIN_PADDING;
}

function setRandomY() {
    return Math.floor(Math.random() * (canvas.height - DEFAULT_BEGIN_PADDING * 2 + 1)) + DEFAULT_BEGIN_PADDING;
}

function setRandomAngle() {
    return Math.random() * (2 * Math.PI);
}

function setRandomHoleSize() {
    return Math.floor(Math.random() * (DEFAULT_SNAKE_HOLE_SIZE_MAX - DEFAULT_SNAKE_HOLE_SIZE_MIN + 1)) + DEFAULT_SNAKE_HOLE_SIZE_MIN;
}

function update(delta) {
    if (gameRunning) {
        if (noCollisionsTimer < DEFAULT_NO_COLLISIONS_TIME) {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            p.update(delta);
            if (p.collisionsCheck) {
                gameRunning = false;
                break;
            }
        }
        if (!gameRunning) {
            $('#gameover').modal('show');
        }
    }
}

function draw(interpolationPercentage) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < players.length; i++) {
        players[i].draw(interpolationPercentage);
    }
}

function end(fps, panic) {
    if (panic) {
        var discardedTime = Math.round(MainLoop.resetFrameDelta());
        console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
    }
}

function init() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < players.length; i++) {
        players[i].init();
    }
    gameRunning = true;
    noCollisionsTimer = 0;
    MainLoop.setUpdate(update).setDraw(draw).setEnd(end).start();
}

$(document).ready(function () {
    canvas = document.getElementById('game');
    canvas.width = $('.panel-body').width();
    canvas.height = $('.panel-body').height();
    context = canvas.getContext("2d");
    players.push(new Player("Player 1", 'red'));
    players.push(new Player("Player 2", 'blue'));
    $(this).keydown(function (e) {
        e.preventDefault();
        if (e.keyCode == KEY_PLAYER1_LEFT) {
            players[0].keyPressedLeft = 1;
        }
        if (e.keyCode == KEY_PLAYER1_RIGHT) {
            players[0].keyPressedRight = 1;
        }
        if (e.keyCode == KEY_PLAYER2_LEFT) {
            players[1].keyPressedLeft = 1;
        }
        if (e.keyCode == KEY_PLAYER2_RIGHT) {
            players[1].keyPressedRight = 1;
        }
    });
    $(this).keyup(function (e) {
        e.preventDefault();
        if (e.keyCode == KEY_PLAYER1_LEFT) {
            players[0].keyPressedLeft = 0;
        }
        if (e.keyCode == KEY_PLAYER1_RIGHT) {
            players[0].keyPressedRight = 0;
        }
        if (e.keyCode == KEY_PLAYER2_LEFT) {
            players[1].keyPressedLeft = 0;
        }
        if (e.keyCode == KEY_PLAYER2_RIGHT) {
            players[1].keyPressedRight = 0;
        }
    });
    $('#retry').click(function () {
        $('#gameover').modal('hide');
        init();
    });
    init();
});