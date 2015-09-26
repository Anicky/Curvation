var util = require("util")
var io = require("socket.io")
var Player = require("./src/js/Player");
var Point = require("./src/js/Point");
var Game = require("./src/js/Game");
var ServerDisplay = require('./src/js/ServerDisplay');
var ServerGame = require('./src/js/ServerGame');
var ServerLog = require('./src/js/ServerLog');
var config = require('./config.json');
var fs = require("fs");
var http = require('http');
var express = require('express');
var vhost = require('vhost');
var winston = require('winston');

function read(f) {
    return fs.readFileSync(f).toString();
}
function include(f) {
    eval.apply(global, [read(f)]);
}

include('./src/js/tools.js');

var socket;
var app;
var server;
var host;
var game;
var serverGame;
var serverLog;

function logFormatter(args) {
    var dateTimeComponents = new Date().toLocaleDateString(config.serverLocale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
    return dateTimeComponents + ' - [' + args.level + '] ' + args.message;
}

function init() {
    winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, {timestamp: true, colorize: true, formatter: logFormatter});
    winston.add(winston.transports.File, {
        filename: config.serverLog, json: false,
        formatter: logFormatter
    });
    app = new express();
    host = vhost(config.serverUrl, express.static('public'));
    server = http.createServer(app);
    socket = io.listen(server);
    app.use(host);
    server.listen(config.serverPort);
    game = new Game();
    serverLog = new ServerLog(winston);
    serverGame = new ServerGame(game, socket, serverLog);
    game.display = new ServerDisplay(config.serverDisplayWidth, config.serverDisplayHeight);
    socket.sockets.on("connection", onSocketConnection);
    serverLog.serverStart();
};

function onSocketConnection(client) {
    serverGame.clientConnect(client);
    client.on("disconnect", onClientDisconnect);
    client.on("newPlayer", onNewPlayer);
    client.on("movePlayer", onMovePlayer);
    client.on("message", onMessage);
}

function onClientDisconnect() {
    serverGame.clientDisconnect(this);
}

function onNewPlayer(data) {
    serverGame.addPlayer(this, data);
}

function onMovePlayer(data) {
    serverGame.movePlayer(this, data);
}

function onMessage(data) {
    if(data.start) {
        serverGame.startGame(this);
    }
}

init();