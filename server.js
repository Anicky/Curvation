var util = require("util")
var io = require("socket.io")
var Player = require("./src/js/Player");
var Point = require("./src/js/Point");
var Game = require("./src/js/Game");
var ServerDisplay = require('./src/js/ServerDisplay');
var fs = require("fs");
var http = require('http');
var express = require('express');
var vhost = require('vhost');
var MainLoop = require('./public/libs/mainloop.min.js');

function read(f) {
    return fs.readFileSync(f).toString();
}
function include(f) {
    eval.apply(global, [read(f)]);
}

include('./src/js/tools.js');

var socket;
var colors;
var app;
var server;
var host;
var game;
var pause = false;

function init() {
    app = new express();
    host = vhost("dev.curvation.fr", express.static('public'));
    server = http.createServer(app);
    colors = ['#D62525', '#2D70EA', '#396F19', '#F1BC42'];
    socket = io.listen(server);
    setEventHandlers();
    app.use(host);
    server.listen(8080);
    game = new Game();
    var serverDisplay = new ServerDisplay();
    serverDisplay.width = 600;
    serverDisplay.height = 600;
    game.display = serverDisplay;
    util.log("Server started.");
};

var setEventHandlers = function () {
    socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
    util.log("New player has connected: " + client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("newPlayer", onNewPlayer);
    client.on("movePlayer", onMovePlayer);
    client.on("message", onMessage);
};

function onClientDisconnect() {
    util.log("Player has disconnected: " + this.id);
    var removePlayer = playerById(this.id);
    if (!removePlayer) {
        util.log("Player not found: " + this.id);
        return;
    }
    ;
    game.players.splice(game.players.indexOf(removePlayer), 1);
    this.broadcast.emit("removePlayer", {id: this.id});
};

function onNewPlayer(data) {
    game.addPlayer(data.name, colors[game.players.length], this.id);
    this.emit("serverMessage", {message: "getCurrentPlayerId", id: this.id});
    var newPlayer = game.players.slice(-1).pop();
    this.broadcast.emit("newPlayer", {
        id: newPlayer.id,
        name: newPlayer.name,
        color: newPlayer.color
    });
    if (game.players.length === 1) {
        this.emit("serverMessage", {message: "init"});
    } else {
        if (game.players.length === 2) {
            var author = game.players[0].id;
            socket.to(author).emit("serverMessage", {message: "ready"});
        }
        this.emit("serverMessage", {message: "wait"});
    }
    var i, existingPlayer;
    for (i = 0; i < game.players.length; i++) {
        existingPlayer = game.players[i];
        this.emit("newPlayer", {
            id: existingPlayer.id,
            name: existingPlayer.name,
            color: existingPlayer.color
        });
    }
    ;
};

function onMovePlayer(data) {
    var player = game.getPlayer(this.id);
    if (player) {
        player.checkKey(data.keyCode, KEY_CODES[0], data.isKeyPressed);
    }
};

function update(delta) {
    if (!pause) {
        game.update(delta);
        var playersOrdered = game.getPlayersOrdered();
        var playersToEmit = new Array();
        for(var i = 0; i < playersOrdered.length; i++) {
            playersToEmit.push({name:playersOrdered[i].name, color:playersOrdered[i].color, score:playersOrdered[i].score});
        }
        socket.sockets.emit("serverMessage", {message: "updateScores", players: playersToEmit});
        if (!game.gameRunning) {
            pause = true;
            var winner = null;
            for (var i = 0; i < game.players.length; i++) {
                if (!game.players[i].collisionsCheck) {
                    winner = game.players[i];
                    break;
                }
            }
            socket.sockets.emit("serverMessage", {message: "roundEnd", winner: winner.id});
            setTimeout(function () {
                pause = false;
                game.run();
                socket.sockets.emit("serverMessage", {message: "roundStart"});
                util.log("Game started.");
            }, 2000);
        }
    }
}

function draw(interpolationPercentage) {
    var playersPoints = game.getPlayerPoints();
    for (var i = 0; i < game.players.length; i++) {
        var entities = [];
        entities = entities.concat(playersPoints);
        entities = entities.concat(game.getPlayerArrows(game.players[i].id));
        socket.to(game.players[i].id).emit("draw", {entities: entities});
    }
}

function end(fps, panic) {
}


function onMessage(data) {
    if (data.start && (game.players[0] === playerById(this.id))) {
        game.run();
        MainLoop.setUpdate(update).setDraw(draw).setEnd(end).start();
        this.emit("serverMessage", {message: "start"});
        this.broadcast.emit("serverMessage", {message: "start"});
        util.log("Game started.");
    }
}

function playerById(id) {
    var i;
    for (i = 0; i < game.players.length; i++) {
        if (game.players[i].id == id)
            return game.players[i];
    }
    return false;
};

init();