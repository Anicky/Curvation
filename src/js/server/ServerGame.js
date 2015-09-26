function ServerGame(game, socket, log) {
    this.game = game;
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
            this.socket.sockets.emit("serverMessage", {message: "updateScores", players: playersToEmit});
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
                this.socket.sockets.emit("serverMessage", {message: "roundEnd", winner: winner.id});
                var that = this;
                setTimeout(function () {
                    that.game.run();
                    that.socket.sockets.emit("serverMessage", {message: "roundStart"});
                    that.log.gameStart();
                }, 2000);
            }
        }
    }
};

ServerGame.prototype.draw = function (interpolationPercentage) {
    var playersPoints = this.game.getPlayerPoints();
    for (var i = 0; i < this.game.players.length; i++) {
        var entities = [];
        entities = entities.concat(playersPoints);
        entities = entities.concat(this.game.getPlayerArrows(this.game.players[i].id));
        this.socket.to(this.game.players[i].id).emit("draw", {entities: entities});
    }
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
};

ServerGame.prototype.addPlayer = function (client, data) {
    this.game.addPlayer(data.name, PLAYER_COLORS[this.game.players.length], client.id);
    client.emit("serverMessage", {message: "getCurrentPlayerId", id: client.id});
    var newPlayer = this.game.players.slice(-1).pop();
    client.broadcast.emit("newPlayer", {
        id: newPlayer.id,
        name: newPlayer.name,
        color: newPlayer.color
    });
    if (this.game.players.length === 1) {
        client.emit("serverMessage", {message: "init"});
    } else {
        if (this.game.players.length === 2) {
            var author = this.game.players[0].id;
            this.socket.to(author).emit("serverMessage", {message: "ready"});
        }
        client.emit("serverMessage", {message: "wait"});
    }
    var i, existingPlayer;
    for (i = 0; i < this.game.players.length; i++) {
        existingPlayer = this.game.players[i];
        client.emit("newPlayer", {
            id: existingPlayer.id,
            name: existingPlayer.name,
            color: existingPlayer.color
        });
    }
};

ServerGame.prototype.movePlayer = function (client, data) {
    var player = this.game.getPlayer(client.id);
    if (player) {
        player.checkKey(data.keyCode, KEY_CODES[0], data.isKeyPressed);
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
        this.log.gameStart();
    }
};

if (typeof require != 'undefined') {
    var MainLoop = require('../../../public/libs/mainloop.min.js');
}

if (typeof module != 'undefined') {
    module.exports = ServerGame;
}