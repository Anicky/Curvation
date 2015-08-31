var players = [];
var playersOrdered = null;
var canvas = null;
var context = null;
var gameRunning = true;
var timer = 0;
var gameLaunched = false;
var gamePaused = false;
var socket;

function update(delta) {
    if ((gameRunning) && (!gamePaused)) {
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

function checkPlayersKey(keyCode, isKeyPressed) {
    if (gameRunning && !gamePaused) {
        for (var i = 0; i < players.length; i++) {
            players[i].checkKey(keyCode, KEY_CODES[i], isKeyPressed);
        }
    }
}

var setEventHandlers = function () {
    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("newPlayer", onNewPlayer);
    socket.on("movePlayer", onMovePlayer);
    socket.on("removePlayer", onRemovePlayer);
};

// Socket connected
function onSocketConnected() {
    console.log("Connected to socket server");
    var pseudo = prompt("Quel est votre pseudo ?");
    socket.emit("newPlayer", {name: pseudo});
}

// Socket disconnected
function onSocketDisconnect() {
    console.log("Disconnected from socket server");
}

// New player
function onNewPlayer(data) {
    console.log("New player connected: " + data.id);
    // Initialise the new player
    var newPlayer = new Player(data.name, data.color, data.x, data.y);
    newPlayer.id = data.id;

    // Add new player to the remote players array
    players.push(newPlayer);
    updateScoresTable();
}

// Move player
function onMovePlayer(data) {
    // @TODO
}

// Remove player
function onRemovePlayer(data) {
    var removePlayer = playerById(data.id);
    if (!removePlayer) {
        console.log("Player not found: " + data.id);
        return;
    }
    players.splice(players.indexOf(removePlayer), 1);
    updateScoresTable();
}

function playerById(id) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            return players[i];
        }
    }
    return false;
}

$(document).ready(function () {
    // Init canvas
    $(".startButton").prop("disabled", true);
    canvas = document.getElementById('game');
    canvas.width = $('.panel-body').width();
    canvas.height = $('.panel-body').height();
    context = canvas.getContext("2d");

    if (typeof io != 'undefined') {
        socket = io.connect("http://localhost:8080");
        setEventHandlers();
        $('.playersButtons, .startButton').slideToggle();
    }

    // Bind all events for the movement
    $(this).keydown(function (e) {
        e.preventDefault();
        checkPlayersKey(e.keyCode, true);
    });
    $(this).keyup(function (e) {
        e.preventDefault();
        checkPlayersKey(e.keyCode, false);
    });

    // Add player
    $(".addPlayerButton").click(function () {
        var playerId = players.length;
        var player = new Player("Player " + (playerId + 1), PLAYER_COLORS[playerId]);
        player.init();
        players.push(player);

        // Update players score
        updateScoresTable();

        // Display remove button
        $(".removePlayerButton").removeClass("hide");
        $(".startButton").prop("disabled", false);

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
            $(".startButton").prop("disabled", true);
        }
    });

    // Start the party
    $(".startButton").click(function () {
        if (!gameLaunched) {
            gameLaunched = true;
            $('.playersButtons, .startButton, .pauseButton').slideToggle();
            init();
        }
    });

    // Pause/Play the game
    $(".pauseButton").click(function () {
        if (gamePaused) {
            $(".pauseButton").html('Pause');
            gamePaused = false;
        } else {
            $(".pauseButton").html('Play');
            gamePaused = true;
        }
    });
});