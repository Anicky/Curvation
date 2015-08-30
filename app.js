var util = require("util")
var io = require("socket.io")
var Player = require("./public/js/Player").Player;
var Point = require("./public/js/Point").Point;
var fs = require("fs");

function read(f) {
    return fs.readFileSync(f).toString();
}
function include(f) {
    eval.apply(global, [read(f)]);
}

include('./public/js/tools.js');

var socket;
var players;
var colors;

function init() {
    players = [];
    colors = ['#D62525', '#2D70EA', '#396F19', '#F1BC42'];
    socket = io.listen(8080);
    setEventHandlers();
};

var setEventHandlers = function () {
    socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
    util.log("New player has connected: " + client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("newPlayer", onNewPlayer);
    client.on("movePlayer", onMovePlayer);
};

function onClientDisconnect() {
    util.log("Player has disconnected: " + this.id);
    var removePlayer = playerById(this.id);
    if (!removePlayer) {
        util.log("Player not found: " + this.id);
        return;
    }
    ;
    players.splice(players.indexOf(removePlayer), 1);
    this.broadcast.emit("removePlayer", {id: this.id});
};

function onNewPlayer(data) {
    var newPlayer = new Player(data.name, colors[players.length]);
    newPlayer.id = this.id;
    newPlayer.init();
    this.broadcast.emit("newPlayer", {
        id: newPlayer.id,
        name: newPlayer.name,
        x: newPlayer.x,
        y: newPlayer.y,
        color: newPlayer.color
    });
    players.push(newPlayer);
    var i, existingPlayer;
    for (i = 0; i < players.length; i++) {
        existingPlayer = players[i];
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
    //var movePlayer = playerById(this.id);
    //if (!movePlayer) {
    //    util.log("Player not found: " + this.id);
    //    return;
    //}
    //;
    //movePlayer.setX(data.x);
    //movePlayer.setY(data.y);
    //this.broadcast.emit("movePlayer", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
};

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    }
    return false;
};

init();