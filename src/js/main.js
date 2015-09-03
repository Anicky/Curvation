var playersOrdered = null;
var timer = 0;
var socket;
var onlineGame = false;
var game;

var key_left_pressed = false;
var key_right_pressed = false;

function updateScoresTable() {
    playersOrdered = game.players.slice(0);
    playersOrdered.sort(function (a, b) {
        return b.score - a.score;
    });
    $('#scores').html('');
    for (var i = 0; i < playersOrdered.length; i++) {
        $('#scores').append('<div class="row scores-line" id="player-' + i + '" style="color: ' + playersOrdered[i].color + '"><div class="col-xs-2 scores-color"><span style="background-color: ' + playersOrdered[i].color + ';"></span></div><div class="col-xs-7 scores-name">' + playersOrdered[i].name + '</div><div class="col-xs-3 scores-points">' + playersOrdered[i].score + '</div></div>');
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
    var points = data.points;
    for(var i =0; i < points.length; i++) {
        for(var j=0; j < points[i].length; j++) {
            var p = points[i][j];
            p = new Point(points[i][j].x, points[i][j].y, points[i][j].size);
            p.draw(game.context);
        }
    }
}

function onServerMessage(data) {
    if (data.message === 'init') {
        $(".startButton").slideToggle();
    } else if (data.message === 'wait') {
        $(".waitButton").slideToggle();
    } else if (data.message == 'ready') {
        $(".startButton").prop("disabled", false);
    } else if (data.message == 'start') {
        game.gameLaunched = true;
        $(".runButtons").slideToggle();
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
    var newPlayer = new Player(data.name, data.color, data.x, data.y);
    newPlayer.id = data.id;

    // Add new player to the remote players array
    game.addPlayer(newPlayer);
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
        return;
    }
    game.players.splice(game.players.indexOf(removePlayer), 1);
    updateScoresTable();
}

function playerById(id) {
    for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].id == id) {
            return game.players[i];
        }
    }
    return false;
}

function update(delta) {
    game.update(delta);
}

function draw(interpolationPercentage) {
    game.draw(interpolationPercentage);
}

function end(fps, panic) {
    game.end(fps, panic);
}

$(document).ready(function () {
    // Init canvas
    $(".startButton, .onlineGameButton, .waitButton").prop("disabled", true);
    game = new Game();
    game.canvas = document.getElementById('game');
    game.canvas.width = $('.panel-body').width();
    game.canvas.height = $('.panel-body').height();
    game.context = game.canvas.getContext("2d");

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
        var player = new Player("Player " + (playerId + 1), PLAYER_COLORS[playerId]);
        player.init(null, null, game);
        game.addPlayer(player);

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
            $('.playersButtons, .startButton, .gameRunningButtons').slideToggle();
            game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
            game.gameLaunched = true;
            game.init();
            MainLoop.setUpdate(update).setDraw(draw).setEnd(end).start();
        } else if (!game.gameLaunched && onlineGame) {
            socket.emit("message", {start: true});
        }
    });

    // Pause/Play the game
    $(".pauseButton").click(function () {
        if (!game.gamePaused) {
            $(".playButton").show();
            $(".pauseButton").hide();
            game.gamePaused = true;
        }
    });
    $(".playButton").click(function () {
        if (game.gamePaused) {
            $(".playButton").hide();
            $(".pauseButton").show();
            game.gamePaused = false;
        }
    });
});