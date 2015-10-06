function ServerGame(socket, log) {
    this.game = new Game();
    this.game.mode = GAME_MODE_ONLINE;
    this.socket = socket;
    this.log = log;
}

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
                this.socket.sockets.emit("serverMessage", {message: "roundEnd", winner: winner.id});
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
                    that.socket.sockets.emit("serverMessage", {message: "roundStart", players: playersData});
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

ServerGame.prototype.clientConnect = function (client) {
    this.log.playerConnection(client.id);
};

ServerGame.prototype.clientDisconnect = function (client) {
    this.log.playerDisconnection(client.id);
    var removePlayer = this.game.getPlayer(client.id);
    if (!removePlayer) {
        this.log.playerNotFound(client.id);
        return;
    }
    this.game.players.splice(this.game.players.indexOf(removePlayer), 1);
    client.broadcast.emit("removePlayer", {id: client.id});
    if (this.game.players.length === 0) {
        this.game = new Game();
        this.game.mode = GAME_MODE_ONLINE;
    }
};

ServerGame.prototype.addPlayer = function (client, data) {
    this.game.addPlayer(data.name, PLAYER_COLORS[this.game.players.length], client.id);
    var newPlayer = this.game.players.slice(-1).pop();
    newPlayer.setRandomPosition();
    client.emit("serverMessage", {
        message: "getCurrentPlayerId",
        id: client.id
    });
    client.broadcast.emit("newPlayer", {
        id: newPlayer.id,
        name: newPlayer.name,
        color: newPlayer.color,
        x: newPlayer.x,
        y: newPlayer.y,
        direction: newPlayer.direction
    });
    var i, existingPlayer;
    for (i = 0; i < this.game.players.length; i++) {
        existingPlayer = this.game.players[i];
        client.emit("newPlayer", {
            id: existingPlayer.id,
            name: existingPlayer.name,
            color: existingPlayer.color,
            x: existingPlayer.x,
            y: existingPlayer.y,
            direction: existingPlayer.direction
        });
    }
    if (this.game.players.length === 1) {
        client.emit("serverMessage", {message: "init"});
    } else {
        if (this.game.players.length === 2) {
            var author = this.game.players[0].id;
            this.socket.to(author).emit("serverMessage", {message: "ready"});
        }
        client.emit("serverMessage", {message: "wait"});
    }
};

ServerGame.prototype.movePlayer = function (client, data) {
    var player = this.game.getPlayer(client.id);
    if (player) {
        player.checkKey(data.keyCode, KEY_CODES[0], data.isKeyPressed);
        client.broadcast.emit("movePlayer", {playerId: client.id, data: data});
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
        client.emit("serverMessage", {message: "start"});
        client.broadcast.emit("serverMessage", {message: "start"});
        this.log.gameStart(this.game.players);
    }
};

if (typeof require != 'undefined') {
    var Game = require("../shared/Game");
    var MainLoop = require('../../../public/libs/mainloop.min.js');
}

if (typeof module != 'undefined') {
    module.exports = ServerGame;
}