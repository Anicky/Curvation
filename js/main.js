/**
 * La première dimension du tableau correspond aux numéros des joueurs.
 * La deuxième dimension correspond aux touches assignés pour la gauche (index 0) et pour la droite (index 1)
 * KeyCodes : 37 = LEFT, 39 = RIGHT, 83 = S, 68 = D, G = 71, H = 72, L = 76, M = 77
 */
const KEY_CODES = [[37, 39], [83, 68], [71, 72], [76, 77]];

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
var playersOrdered = null;
var canvas = null;
var context = null;
var gameRunning = true;
var noCollisionsTimer = 0;

var img_speedup = null;
var speedup_appeared = false;
var speedup_x = 0;
var speedup_y = 0;

var img_sizeup = null;
var sizeup_appeared = false;
var sizeup_x = 0;
var sizeup_y = 0;

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
        for (var i = 0; i < players.length; i++) {
            var p = players[i];
            if (!p.collisionsCheck) {
                p.update(delta);
                if (p.collisionsCheck) {
                    var playersLost = 0;
                    for (var j = 0; j < players.length; j++) {
                        if (!players[j].collisionsCheck) {
                            players[j].score++;
                        } else {
                            playersLost++;
                        }
                    }
                    updateScoresTable();
                    if (playersLost === players.length - 1) {
                        gameRunning = false;
                        break;
                    }
                }
            }
        }
        if (!gameRunning) {
            var winner = null;
            for (var i = 0; i < players.length; i++) {
                if (!players[i].collisionsCheck) {
                    winner = players[i];
                    break;
                }
            }
            $('#gameover .modal-body').html('<p style="color:' + winner.color + '"><span class="modal-playername">' + winner.name + '</span> wins !</p>');
            $('#gameover').modal('show');
            setTimeout(function () {
                $('#gameover').modal('hide');
                init();
            }, 2000);
        }
    }
}

function draw(interpolationPercentage) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (speedup_appeared) {
        context.drawImage(img_speedup, speedup_x, speedup_y);
    } else {
        var probability = Math.random() * 100;
        if (probability < 0.5) {
            speedup_x = setRandomX();
            speedup_y = setRandomY();
            speedup_appeared = true;
        }
    }
    if (sizeup_appeared) {
        context.drawImage(img_sizeup, sizeup_x, sizeup_y);
    } else {
        var probability = Math.random() * 100;
        if (probability < 0.5) {
            sizeup_x = setRandomX();
            sizeup_y = setRandomY();
            sizeup_appeared = true;
        }
    }
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
    speedup_appeared = false;
    sizeup_appeared = false;
    for (var i = 0; i < players.length; i++) {
        players[i].init();
    }
    gameRunning = true;
    noCollisionsTimer = 0;
    MainLoop.setUpdate(update).setDraw(draw).setEnd(end).start();
}

function updateScoresTable() {
    playersOrdered = players.slice(0);
    playersOrdered.sort(function (a, b) {
        return b.score - a.score;
    });
    $('#scores').html('');
    for (var i = 0; i < playersOrdered.length; i++) {
        $('#scores').append('<div class="row scores-line" id="player-' + i + '" style="color: ' + playersOrdered[i].color + '"><div class="col-xs-2 scores-color"><span style="background-color: ' + playersOrdered[i].color + ';"></span></div><div class="col-xs-7 scores-name">' + playersOrdered[i].name + '</div><div class="col-xs-3 scores-points">' + playersOrdered[i].score + '</div></div>');
    }
}

$(document).ready(function () {
    canvas = document.getElementById('game');
    canvas.width = $('.panel-body').width();
    canvas.height = $('.panel-body').height();
    context = canvas.getContext("2d");
    img_speedup = new Image();
    img_speedup.src = 'img/items/speedup.png';
    img_sizeup = new Image();
    img_sizeup.src = 'img/items/sizeup.png';
    players.push(new Player("Player 1", '#D62525'));
    players.push(new Player("Player 2", '#2D70EA'));
    players.push(new Player("Player 3", '#396F19'));
    players.push(new Player("Player 4", '#F1BC42'));
    updateScoresTable();
    $(this).keydown(function (e) {
        e.preventDefault();
        for (var i = 0; i < players.length; i++) {
            players[i].checkKey(e.keyCode, KEY_CODES[i], 1);
        }
    });
    $(this).keyup(function (e) {
        e.preventDefault();
        for (var i = 0; i < players.length; i++) {
            players[i].checkKey(e.keyCode, KEY_CODES[i], 0);
        }
    });
    init();
});