var socket;
var game;
var pause = false;
var onlineGame = false;
var key_left_pressed = false;
var key_right_pressed = false;
var onlinePlayerId = null;

function end(fps, panic) {
    if (panic) {
        var discardedTime = Math.round(MainLoop.resetFrameDelta());
        console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
    }
}

function update(delta) {
    if (!pause) {
        game.update(delta);
        updateScoresTable();
        if (!game.gameRunning) {
            pause = true;
            if (game.players.length === 1) {
                $('#gameover .modal-body').html('<p style="color:' + game.players[0].color + '">Game over !</p>');
            } else {
                var winner = null;
                for (var i = 0; i < game.players.length; i++) {
                    if (!game.players[i].collisionsCheck) {
                        winner = game.players[i];
                        break;
                    }
                }
                $('#gameover .modal-body').html('<p style="color:' + winner.color + '"><span class="modal-playername">' + winner.name + '</span> wins !</p>');
            }
            $('#gameover').modal('show');
            setTimeout(function () {
                $('#gameover').modal('hide');
                pause = false;
                game.run();
            }, 2000);
        }
    }
}

function draw(interpolationPercentage) {
    game.draw(interpolationPercentage);
}

function run() {
    game.run();
    MainLoop.setUpdate(update).setDraw(draw).setEnd(end).start();
}

function updateScoresTable(players) {
    if (players === undefined) {
        players = game.getPlayersOrdered();
    }
    $('#scores').html('');
    for (var i = 0; i < players.length; i++) {
        $('#scores').append('<div class="row scores-line" id="player-' + i + '" style="color: ' + players[i].color + '"><div class="col-xs-2 scores-color"><span style="background-color: ' + players[i].color + ';"></span></div><div class="col-xs-7 scores-name">' + players[i].name + '</div><div class="col-xs-3 scores-points">' + players[i].score + '</div></div>');
    }
}

function checkPlayersKey(keyCode, isKeyPressed) {
    if (game.gameRunning && !game.gamePaused) {
        if (onlineGame) {
            if (isKeyPressed) {
                if ((keyCode === KEY_CODES[0][0]) && (!key_left_pressed)) {
                    key_left_pressed = true;
                    socket.emit("movePlayer", {keyCode: keyCode, isKeyPressed: isKeyPressed});
                } else if ((keyCode === KEY_CODES[0][1]) && (!key_right_pressed)) {
                    key_right_pressed = true;
                    socket.emit("movePlayer", {keyCode: keyCode, isKeyPressed: isKeyPressed});
                }
            } else if (keyCode === KEY_CODES[0][0]) {
                key_left_pressed = false;
                socket.emit("movePlayer", {keyCode: keyCode, isKeyPressed: isKeyPressed});
            } else if (keyCode === KEY_CODES[0][1]) {
                key_right_pressed = false;
                socket.emit("movePlayer", {keyCode: keyCode, isKeyPressed: isKeyPressed});
            }
        } else {
            for (var i = 0; i < game.players.length; i++) {
                game.players[i].checkKey(keyCode, KEY_CODES[i], isKeyPressed);
            }
        }
    }
}

var setEventHandlers = function () {
    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("newPlayer", onNewPlayer);
    socket.on("movePlayer", onMovePlayer);
    socket.on("removePlayer", onRemovePlayer);
    socket.on("serverMessage", onServerMessage);
    socket.on("draw", onDraw);
};

function onDraw(data) {
    game.display.draw(data.entities);
}

function onServerMessage(data) {
    if (data.message === 'init') {
        $(".startButton").slideToggle();
    } else if (data.message === 'getCurrentPlayerId') {
        onlinePlayerId = data.id;
    } else if (data.message === 'wait') {
        $(".waitButton").slideToggle();
    } else if (data.message == 'ready') {
        $(".startButton").prop("disabled", false);
    } else if (data.message == 'start') {
        game.run();
        $(".runButtons").slideToggle();
    } else if (data.message == 'updateScores') {
        updateScoresTable(data.players);
    } else if (data.message == 'roundEnd') {
        var winner = game.getPlayer(data.winner);
        $('#gameover .modal-body').html('<p style="color:' + winner.color + '"><span class="modal-playername">' + winner.name + '</span> wins !</p>');
        $('#gameover').modal('show');
    } else if (data.message == 'roundStart') {
        $('#gameover').modal('hide');
        game.initDisplay();
    }
}

// Socket connected
function onSocketConnected() {
    var pseudo = prompt("Quel est votre pseudo ?");
    socket.emit("newPlayer", {name: pseudo});
}

// Socket disconnected
function onSocketDisconnect() {
}

// New player
function onNewPlayer(data) {
    // Initialise the new player
    var newPlayer = new Player(data.name, data.color, data.id);
    game.players.push(newPlayer);
    updateScoresTable();
}

// Move player
function onMovePlayer(data) {
    // @TODO
}

// Remove player
function onRemovePlayer(data) {
    game.removePlayer(data.id);
    updateScoresTable();
}

$(document).ready(function () {
    $(".startButton, .onlineGameButton, .waitButton").prop("disabled", true);
    game = new Game();
    var canvas = new CanvasDisplay();
    canvas.context = $("#canvas").get(0).getContext("2d");
    canvas.width = 600;
    canvas.height = 600;
    game.display = canvas;
    $("#canvas").attr('width', canvas.width);
    $("#canvas").attr('height', canvas.height);

    if (typeof io != 'undefined') {
        $(".onlineGameButton").prop("disabled", false);
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

    $(".onlineGameButton").click(function () {
        socket = io();
        $(".gameModeButtons").slideToggle();
        onlineGame = true;
        setEventHandlers();
    });

    $(".localGameButton").click(function () {
        $(".gameModeButtons, .playersButtons, .startButton").slideToggle();
    });

    // Add player
    $(".addPlayerButton").click(function () {
        var playerId = game.players.length;
        game.addPlayer("Player " + (playerId + 1), PLAYER_COLORS[playerId]);

        // Update players score
        updateScoresTable();

        // Display remove button
        $(".removePlayerButton").removeClass("hide");
        $(".startButton").prop("disabled", false);

        // Hide button if the max amount of player is reached
        if (game.players.length === KEY_CODES.length || game.players.length === PLAYER_COLORS.length) {
            $(this).addClass("hide");
        }
    });

    // remove last player
    $(".removePlayerButton").click(function () {
        game.players.pop();

        // Update players score
        updateScoresTable();

        // Display add button
        $(".addPlayerButton").removeClass("hide");

        // Hide button if there is no more player in the game
        if (game.players.length === 0) {
            $(this).addClass("hide");
            $(".startButton").prop("disabled", true);
        }
    });

    // Start the party
    $(".startButton").click(function () {
        if (!game.gameLaunched && !onlineGame) {
            $(".playersButtons, .startButton, .gameRunningButtons").slideToggle();
            run();
        } else if (!game.gameLaunched && onlineGame) {
            socket.emit("message", {start: true});
        }
    });

    // Pause/Play the game
    $(".pauseButton").click(function () {
        game.pause();
        $(".playButton").show();
        $(".pauseButton").hide();
    });
    $(".playButton").click(function () {
        game.pause();
        $(".playButton").hide();
        $(".pauseButton").show();
    });
});