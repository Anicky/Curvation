/**
 * La première dimension du tableau correspond aux numéros des joueurs.
 * La deuxième dimension correspond aux touches assignés pour la gauche (index 0) et pour la droite (index 1)
 * KeyCodes : 37 = LEFT, 39 = RIGHT, 83 = S, 68 = D, G = 71, H = 72, L = 76, M = 77
 */
const KEY_CODES = [[37, 39], [83, 68], [71, 72], [76, 77]];
const PLAYER_COLORS = ['#D62525', '#2D70EA', '#396F19', '#F1BC42'];

const DEFAULT_SNAKE_SIZE = 3;
const DEFAULT_SNAKE_SPEED = 0.1;
const DEFAULT_SNAKE_CURVE = 3;

const DEFAULT_BEGIN_PADDING = 30;
const DEFAULT_WAITING_TIME = 100;
const DEFAULT_NO_COLLISIONS_TIME = 100;

const DEFAULT_SNAKE_HOLE_SIZE_MIN = 8;
const DEFAULT_SNAKE_HOLE_SIZE_MAX = 16;
const DEFAULT_SNAKE_HOLE_MINIMUM_TIME = 20;
const DEFAULT_SNAKE_HOLE_PROBABILITY = 1;

const DEFAULT_SNAKE_ARROW_SPACE = 10;
const DEFAULT_SNAKE_ARROW_SIZE = 50;
const DEFAULT_SNAKE_ARROW_HEADSIZE = 15;

var players = [];
var playersOrdered = null;
var canvas = null;
var context = null;
var gameRunning = true;
var timer = 0;

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
                    if ((players.length === 1) || playersLost === players.length - 1) {
                        gameRunning = false;
                        break;
                    }
                }
            }
        }
        if (!gameRunning) {
            if (players.length === 1) {
                $('#gameover .modal-body').html('<p style="color:' + players[0].color + '">Game over !</p>');
            } else {
                var winner = null;
                for (i = 0; i < players.length; i++) {
                    if (!players[i].collisionsCheck) {
                        winner = players[i];
                        break;
                    }
                }
                $('#gameover .modal-body').html('<p style="color:' + winner.color + '"><span class="modal-playername">' + winner.name + '</span> wins !</p>');
            }
            $('#gameover').modal('show');
            setTimeout(function () {
                $('#gameover').modal('hide');
                init();
            }, 2000);
        }
        timer++;
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
    timer = 0;

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

function drawArrow(context, fromX, fromY, toX, toY, arrowHeadSize, color) {
    var dX = toX - fromX;
    var dY = toY - fromY;
    var angle = Math.atan2(dY, dX);

    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.lineTo(toX - arrowHeadSize * Math.cos(angle - Math.PI / 6), toY - arrowHeadSize * Math.sin(angle - Math.PI / 6));
    context.moveTo(toX, toY);
    context.lineTo(toX - arrowHeadSize * Math.cos(angle + Math.PI / 6), toY - arrowHeadSize * Math.sin(angle + Math.PI / 6));
    context.stroke();
}

$(document).ready(function () {
    // Init canvas
    canvas = document.getElementById('game');
    canvas.width = $('.panel-body').width();
    canvas.height = $('.panel-body').height();
    context = canvas.getContext("2d");

    // Bind all events for the movement
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

    // Add player
    $(".addPlayerButton").click(function () {
        var playerId = players.length;
        players.push(new Player("Player " + (playerId + 1), PLAYER_COLORS[playerId]));

        // Update players score
        updateScoresTable();

        // Display remove button
        $(".removePlayerButton").removeClass("hide");

        // Hide button if the max amount of player is reached
        if (players.length === KEY_CODES.length || players.length === PLAYER_COLORS.length) {
            $(this).addClass("hide");
        }
    });

    // remove last player
    $(".removePlayerButton").click(function () {
        players.pop();

        // Update players score
        updateScoresTable();

        // Display add button
        $(".addPlayerButton").removeClass("hide");

        // Hide button if there is no more player in the game
        if (players.length === 0) {
            $(this).addClass("hide");
        }
    });

    // Start the party
    $(".startButton").click(function () {
        init();
        $(".panel-buttons").slideToggle();
    });
});