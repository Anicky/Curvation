/**
 * La première dimension du tableau correspond aux numéros des joueurs.
 * La deuxième dimension correspond aux touches assignés pour la gauche (index 0) et pour la droite (index 1)
 * KeyCodes : 37 = LEFT, 39 = RIGHT, 83 = S, 68 = D, G = 71, H = 72, L = 76, M = 77
 */
const KEY_CODES = [[37, 39], [83, 68], [71, 72], [76, 77]];

var players = new Array();
var playersOrdered = null;
var canvas = null;
var context = null;
var gameRunning = true;
var noCollisionsTimer = 0;

var socket;

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
                runGame();
            }, 2000);
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

function runGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    gameRunning = true;
    noCollisionsTimer = 0;
    MainLoop.setUpdate(update).setDraw(draw).setEnd(end).start();
}

function init() {
    for (var i = 0; i < players.length; i++) {
        players[i].init();
    }
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
};

// Socket disconnected
function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
    console.log("New player connected: " + data.id);
    // Initialise the new player
    var newPlayer = new Player(data.name, data.color, data.x, data.y);
    newPlayer.id = data.id;

    // Add new player to the remote players array
    players.push(newPlayer);
    updateScoresTable();
};

// Move player
function onMovePlayer(data) {
    // @TODO
};

// Remove player
function onRemovePlayer(data) {
    var removePlayer = playerById(data.id);
    if (!removePlayer) {
        console.log("Player not found: " + data.id);
        return;
    }
    players.splice(players.indexOf(removePlayer), 1);
    updateScoresTable();
};

function playerById(id) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            return players[i];
        }
    }
    return false;
};

$(document).ready(function () {
    // Init canvas
    canvas = document.getElementById('game');
    context = canvas.getContext("2d");
    if (typeof io != 'undefined') {
        socket = io.connect("http://localhost:8080");
        setEventHandlers();
    } else {
        // Init all player
        players.push(new Player("Player 1", '#D62525'));
        players.push(new Player("Player 2", '#2D70EA'));
        players.push(new Player("Player 3", '#396F19'));
        players.push(new Player("Player 4", '#F1BC42'));

        // Update players score
        init();
        updateScoresTable();
    }
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

    // Start the party
    $(".startButton").click(function () {
        runGame();
        $(".startButton").slideToggle();
    });
});