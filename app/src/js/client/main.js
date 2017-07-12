var socket;
var game;
var pause = false;
var onlineGame = false;
var key_left_pressed = false;
var key_right_pressed = false;
var onlinePlayerId = null;
var canvas;
var pseudo = null;

function end(fps, panic) {
    if (panic) {
        var discardedTime = Math.round(MainLoop.resetFrameDelta());
        console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
    }
}

function onlineUpdate(delta) {
    if (!pause) {
        game.update(delta);
        if (game.collisionInFrame) {
            updateScoresTable();
        }
    }
}

function update(delta) {
    if (!pause) {
        game.update(delta);
        if (game.collisionInFrame) {
            updateScoresTable();
        }
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
                game.setRandomPositions();
                game.run();
            }, 2000);
        }
    }
}

function draw(interpolationPercentage) {
    game.draw(interpolationPercentage);
}

function run() {
    game.setRandomPositions();
    game.run();
    MainLoop.setUpdate(update).setDraw(draw).setEnd(end).start();
}

function onlineRun() {
    game.run();
    MainLoop.setUpdate(onlineUpdate).setDraw(draw).setEnd(end).start();
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
            var currentPlayer = game.getPlayer(onlinePlayerId);
            currentPlayer.checkKey(keyCode, KEY_CODES[0], isKeyPressed);
            if (isKeyPressed) {
                if ((keyCode === KEY_CODES[0][0]) && (!key_left_pressed)) {
                    key_left_pressed = true;
                    socket.emit('playerInput', {keyCode: keyCode, isKeyPressed: isKeyPressed});
                } else if ((keyCode === KEY_CODES[0][1]) && (!key_right_pressed)) {
                    key_right_pressed = true;
                    socket.emit('playerInput', {keyCode: keyCode, isKeyPressed: isKeyPressed});
                }
            } else if (keyCode === KEY_CODES[0][0]) {
                key_left_pressed = false;
                socket.emit('playerInput', {keyCode: keyCode, isKeyPressed: isKeyPressed});
            } else if (keyCode === KEY_CODES[0][1]) {
                key_right_pressed = false;
                socket.emit('playerInput', {keyCode: keyCode, isKeyPressed: isKeyPressed});
            }
        } else {
            for (var i = 0; i < game.players.length; i++) {
                game.players[i].checkKey(keyCode, KEY_CODES[i], isKeyPressed);
            }
        }
    }
}

var setEventHandlers = function () {
    // À la connection du joueur
    socket.on('connect', onSocketConnected);

    // Informations provenant du serveur sur les joueurs
    socket.on('newPlayer', onNewPlayer);
    socket.on('movePlayer', onMovePlayer);
    socket.on('removePlayer', onRemovePlayer);

    // Informations provenant du serveur sur l'état de la partie
    socket.on('roundStart', onRoundStart);
    socket.on('updateScores', onUpdateScores);
    socket.on('roundEnd', onRoundEnd);

    // Traitement des messages génériques provenant du serveur
    socket.on('message', onMessage);

    // À la déconnection du joueur
    socket.on('disconnect', onSocketDisconnect);
};

// Event: à la connection d'un joueur
function onSocketConnected() {
    onlineGame = true;

    // Récupère l'ID du joueur
    onlinePlayerId = this.id;
    game.currentPlayerId = onlinePlayerId;

    // Envoi les informations du joueur au serveur
    socket.emit('newPlayer', {name: pseudo});

    // Cache les modes de jeu
    $('.gameModeButtons').slideToggle();
}

// Event: Ajout d'un autre joueur
function onNewPlayer(data) {
    // Initialise the new player
    game.addPlayer(data.name, data.color, data.id);

    var player = game.getPlayer(data.id);
    player.x = data.x;
    player.y = data.y;
    player.direction = data.direction;

    updateScoresTable();
}

// Event: Déplacement d'un joueur
function onMovePlayer(data) {
    var player = game.getPlayer(data.playerId);
    if (player) {
        player.checkKey(data.data.keyCode, KEY_CODES[0], data.data.isKeyPressed);
    }
}

// Event: Départ d'un autre joueur
function onRemovePlayer(data) {
    game.removePlayer(data.id);
    updateScoresTable();
}

// Event: Démarrage d'un round
function onRoundStart(data) {
    for (var i = 0; i < game.players.length; i++) {
        var player = game.getPlayer(data.players[i].id);
        player.x = data.players[i].x;
        player.y = data.players[i].y;
        player.direction = data.players[i].direction;
    }
    $('#gameover').modal('hide');
    game.run();
}

// Event: Mise à jour des scores
// TODO: à appliquer lorsqu'un joueur perd
function onUpdateScores(data) {
    updateScoresTable(data.players);
}

// Event: Fin d'un round
function onRoundEnd(data) {
    var winner = game.getPlayer(data.winner);
    $('#gameover .modal-body').html('<p style="color:' + winner.color + '"><span class="modal-playername">' + winner.name + '</span> wins !</p>');
    $('#gameover').modal('show');
    updateScoresTable(data.players);
}

// Event: Récupération d'un message
function onMessage(data) {
    if (data.message === 'init') {
        $('.startButton').slideToggle();
    } else if (data.message === 'wait') {
        $('.waitButton').slideToggle();
    } else if (data.message === 'ready') {
        $('.startButton').prop('disabled', false);
    } else if (data.message === 'start') {
        onlineRun();
        $('.runButtons').slideToggle();
    }
}

// Event: Déconnection du joueur
function onSocketDisconnect() {
}

$(document).ready(function () {
    $('.startButton, .onlineGameButton, .waitButton').prop('disabled', true);
    game = new Game();
    $('#canvas').attr('width', Math.min(700, $('.panel-game').width()))
        .attr('height', Math.min(700, $('.panel-game').width()));
    var canvasDOM = $('#canvas').get(0);
    canvas = new CanvasDisplay(canvasDOM.width, canvasDOM.getContext('2d'));
    game.drawer = canvas;

    if (typeof io !== 'undefined') {
        $('.onlineGameButton').prop('disabled', false);
    }

    // Bind all events for the movement
    $(this).keydown(function (e) {
        checkPlayersKey(e.keyCode, true);
    });
    $(this).keyup(function (e) {
        checkPlayersKey(e.keyCode, false);
    });

    $(window).resize(function () {
        $('#canvas').attr('width', Math.min(700, $('.panel-game').width()));
        $('#canvas').attr('height', Math.min(700, $('.panel-game').width()));
        canvas.size = $('#canvas').get(0).width;
    });

    $('.onlineGameButton').click(function () {
        pseudo = prompt('Quel est votre pseudo ?');
        if (pseudo) {
            game.mode = GAME_MODE_ONLINE;
            socket = io();
            setEventHandlers();
        } else {
            $('.onlineGameButton').blur();
        }
    });

    $('.localGameButton').click(function () {
        game.mode = GAME_MODE_LOCAL;
        $('.gameModeButtons, .playersButtons, .startButton').slideToggle();
    });

    // Add player
    $('.addPlayerButton').click(function () {
        var playerId = game.players.length;
        game.addPlayer('Player ' + (playerId + 1), PLAYER_COLORS[playerId]);

        // Update players score
        updateScoresTable();

        // Display remove button
        $('.removePlayerButton').removeClass('hide');
        $('.startButton').prop('disabled', false);

        // Hide button if the max amount of player is reached
        if (game.players.length === KEY_CODES.length || game.players.length === PLAYER_COLORS.length) {
            $(this).addClass('hide');
        }
    });

    // remove last player
    $('.removePlayerButton').click(function () {
        game.players.pop();

        // Update players score
        updateScoresTable();

        // Display add button
        $('.addPlayerButton').removeClass('hide');

        // Hide button if there is no more player in the game
        if (game.players.length === 0) {
            $(this).addClass('hide');
            $('.startButton').prop('disabled', true);
        }
    });

    // Start the party
    $('.startButton').click(function () {
        if (!game.gameRunning && !onlineGame) {
            $('.playersButtons, .startButton, .gameRunningButtons').slideToggle();
            run();
        } else if (!game.gameRunning && onlineGame) {
            socket.emit('startGame');
        }
    });

    // Pause/Play the game
    $('.pauseButton').click(function () {
        game.pause();
        $('.playButton').show();
        $('.pauseButton').hide();
    });
    $('.playButton').click(function () {
        game.pause();
        $('.playButton').hide();
        $('.pauseButton').show();
    });
});