var util = require("util");
var io = require("socket.io");
var Point = require("./src/js/Point").Point;
var Player = require("./src/js/Player").Player;
var Game = require("./src/js/Game").Game;
var fs = require("fs");
var http = require('http');
var io = require('socket.io');
var express = require('express');
var vhost = require('vhost');

function read(f) {
    return fs.readFileSync(f).toString();
}
function include(f) {
    eval.apply(global, [read(f)]);
}

include('./src/js/tools.js');
include('./public/libs/mainloop.min.js');

var socket;
var colors;
var app;
var server;
var host;
var game;

function init() {
    app = new express();
    host = vhost("dev.curvation.fr", express.static('public'));
    server = http.createServer(app);
    colors = ['#D62525', '#2D70EA', '#396F19', '#F1BC42'];
    socket = io.listen(server);
    setEventHandlers();
    app.use(host);
    server.listen(80);
    game = new Game();
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
    var newPlayer = new Player(data.name, colors[game.players.length]);
    newPlayer.id = this.id;
    newPlayer.init();
    this.broadcast.emit("newPlayer", {
        id: newPlayer.id,
        name: newPlayer.name,
        x: newPlayer.x,
        y: newPlayer.y,
        color: newPlayer.color
    });
    game.addPlayer(newPlayer);
    if(game.players.length === 1) {
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
            x: existingPlayer.x,
            y: existingPlayer.y,
            color: existingPlayer.color
        });
    }
    ;
};

function onMovePlayer(data) {
    var clientId = this.id;
    var player = playerById(this.id);
    player.checkKey(data.keyCode, KEY_CODES[0], data.isKeyPressed);
};

function update(delta) {
    game.update(delta);
}

function draw(interpolationPercentage) {
    socket.sockets.emit("draw", {players: game.players, interpolationPercentage: interpolationPercentage});
}

function end(fps, panic) {
    game.end(fps, panic);
}


function onMessage(data) {
    if (data.start && (game.players[0] === playerById(this.id))) {
        this.emit("serverMessage", {message: "start"});
        this.broadcast.emit("serverMessage", {message: "start"});
        game.gameLaunched = true;
        game.init();
        MainLoop.setUpdate(update).setDraw(draw).setEnd(end).start();
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