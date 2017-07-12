/* Node.js API - https://nodejs.org/api */
var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    util = require('util');

/* Express web framework - http://expressjs.com/4x/api.html */
var express = require('express');

/* Express vhost API - https://github.com/expressjs/vhost */
var vhost = require('vhost');

/* socket.io - http://socket.io/docs */
var io = require('socket.io');

/* winston - https://github.com/winstonjs/winston */
var winston = require('winston');

/* Curvation - Classes */
var ServerGame = require('./js/server/ServerGame');
var ServerLog = require('./js/server/ServerLog');

/* Curvation - Server config  */
var config = require('./config.json');

/**
 * @TODO : Effectuer la copie de ce fichier vers le dossier /dist (Gruntfile.js)
 */
/* Curvation - Tools */
include('./src/js/shared/tools.js');

/* Variables */
var socket;
var app;
var server;
var host;
var serverGame;
var serverLog;

init();

/**
 * initialize the server
 */
function init() {
    winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, {timestamp: true, colorize: true, formatter: logFormatter});
    winston.add(winston.transports.File, {
        filename: config.serverLog, json: false,
        formatter: logFormatter
    });

    app = new express();
    app.use('/', express.static(path.join(__dirname, '../dist')));

    host = vhost(config.serverUrl, express.static(path.join(__dirname, '../dist')));
    app.use(host);

    server = http.createServer(app);
    server.listen(config.serverPort);

    socket = io.listen(server);
    socket.sockets.on('connection', onSocketConnection);

    serverLog = new ServerLog(winston);
    serverGame = new ServerGame(socket, serverLog);

    serverLog.serverStart();
}

function onSocketConnection(client) {
    // Connection d'un nouveau joueur
    serverGame.newClientConnected(client);

    // Messages provenant d'un joueur
    client.on('newPlayer', onNewPlayer);
    client.on('startGame', onStartGame);
    client.on('playerInput', onPlayerInput);

    // Déconnection d'un joueur
    client.on('disconnect', onClientDisconnect);
}

function onNewPlayer(data) {
    serverGame.addPlayer(this, data);
}

function onStartGame(data) {
    serverGame.startGame(this, data);
}

function onPlayerInput(data) {
    serverGame.movePlayer(this, data);
}

function onClientDisconnect() {
    serverGame.clientDisconnect(this);
}

function logFormatter(args) {
    var dateTimeComponents = new Date().toISOString();
    return dateTimeComponents + ' ' + args.level.toUpperCase() + ' ' + args.message;
}

function include(f) {
    eval.apply(global, [fs.readFileSync(f).toString()]);
}