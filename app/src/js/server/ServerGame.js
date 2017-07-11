function ServerGame(socket, log) {
    this.socket = socket;
    this.log = log;
    this.resetGame(this);
}

ServerGame.prototype.resetGame = function () {
    this.game = new Game();
    this.game.mode = GAME_MODE_ONLINE;
};

ServerGame.prototype.update = function (delta) {
    var i;
    if (!this.game.gamePaused) {
        this.game.update(delta);
        if (this.game.collisionInFrame) {
            var playersOrdered = this.game.getPlayersOrdered();
            var playersToEmit = [];
            for (i = 0; i < playersOrdered.length; i++) {
                playersToEmit.push({
                    name: playersOrdered[i].name,
                    color: playersOrdered[i].color,
                    score: playersOrdered[i].score
                });
            }
        }
        if (!this.game.gameRunning) {
            this.game.pause();
            var winner = null;
            for (i = 0; i < this.game.players.length; i++) {
                if (!this.game.players[i].collisionsCheck) {
                    winner = this.game.players[i];
                    break;
                }
            }
            if (winner) {
                this.log.gameEnd(winner);
                this.socket.sockets.emit("roundEnd", {winner: winner.id});
                var that = this;
                setTimeout(function () {
                    that.game.setRandomPositions();
                    var playersData = [];
                    for (var i = 0; i < that.game.players.length; i++) {
                        playersData.push({
                            id: that.game.players[i].id,
                            x: that.game.players[i].x,
                            y: that.game.players[i].y,
                            direction: that.game.players[i].direction
                        });
                    }
                    that.game.run();
                    that.socket.sockets.emit("roundStart", {players: playersData});
                    that.log.gameStart(that.game.players);
                }, 2000);
            }
        }
    }
};

ServerGame.prototype.draw = function (interpolationPercentage) {
};

ServerGame.prototype.end = function (fps, panic) {
};

ServerGame.prototype.newClientConnected = function (client) {
    this.log.playerConnection(client.id);
};

ServerGame.prototype.addPlayer = function (client, data) {
    // Ajoute un joueur à la partie
    this.game.addPlayer(data.name, PLAYER_COLORS[this.game.players.length], client.id);

    // Récupère le joueur
    var player = this.game.players.slice(-1).pop();

    // Positionne le joueur aléatoirement sur la map
    player.setRandomPosition();

    // Informe tous les autres joueurs de l'ajout de ce joueur
    client.broadcast.emit("newPlayer", {
        id: player.id,
        name: player.name,
        color: player.color,
        x: player.x,
        y: player.y,
        direction: player.direction
    });

    // Informe le nouveau joueur de la présence de tous les joueurs (lui + autres)
    for (var i = 0; i < this.game.players.length; i++) {
        client.emit("newPlayer", {
            id: this.game.players[i].id,
            name: this.game.players[i].name,
            color: this.game.players[i].color,
            x: this.game.players[i].x,
            y: this.game.players[i].y,
            direction: this.game.players[i].direction
        });
    }
    // Si le joueur est le premier, il initialise la partie
    if (this.game.players.length === 1) {
        client.emit("message", {message: "init"});
    } else {
        // À partir du 2° joueur, on définit le premier joueur comme créateur
        if (this.game.players.length === 2) {
            var author = this.game.players[0].id;
            // On informe le créateur que la partie peut être lancée
            this.socket.to(author).emit("message", {message: "ready"});
        }

        // Le joueur n'est pas le createur de la partie, on l'informe que la partie est en attente
        client.emit("message", {message: "wait"});
    }
};

ServerGame.prototype.startGame = function (client) {
    if (this.game.players[0] === this.game.getPlayer(client.id)) {
        this.game.run();
        var that = this;
        MainLoop.setUpdate(function (delta) {
            that.update(delta);
        }).setDraw(function (interpolationPercentage) {
            that.draw(interpolationPercentage);
        }).setEnd(function (fps, panic) {
            that.end(fps, panic);
        }).start();
        client.emit("message", {message: "start"});
        client.broadcast.emit("message", {message: "start"});
        this.log.gameStart(this.game.players);
    }
};

ServerGame.prototype.movePlayer = function (client, data) {
    var player = this.game.getPlayer(client.id);
    if (player) {
        player.checkKey(data.keyCode, KEY_CODES[0], data.isKeyPressed);
        client.broadcast.emit("movePlayer", {playerId: client.id, data: data});
    }
};

ServerGame.prototype.clientDisconnect = function (client) {
    this.log.playerDisconnection(client.id);

    // Trouve le joueur dans la partie
    var player = this.game.getPlayer(client.id);

    if (!player) {
        this.log.playerNotFound(client.id);
        return;
    }

    // Supprime le joueur de la partie
    this.game.removePlayer(client.id);

    // Informe les autres joueurs de ce départ
    client.broadcast.emit("removePlayer", {id: client.id});

    // Redémarre une partie si il n'y a plus de joueurs
    if (this.game.players.length === 0) {
        this.resetGame(this);
    }
};

if (typeof require != 'undefined') {
    var Game = require("../shared/Game");
    var MainLoop = require('mainloop.js');
}

if (typeof module != 'undefined') {
    module.exports = ServerGame;
}