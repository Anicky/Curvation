function ServerLog(util) {
    this.util = util;
}

ServerLog.prototype.writeLog = function (message, type, data) {
    if (!data || typeof data !== 'undefined') {
        this.util.log(type, message);
    } else {
        this.util.log(type, message, data);
    }
};

ServerLog.prototype.writeDebugLog = function (message, data) {
    this.writeLog('debug', message, data);
};

ServerLog.prototype.writeInfoLog = function (message, data) {
    this.writeLog('info', message, data);
};

ServerLog.prototype.writeErrorLog = function (message, data) {
    this.writeLog('error', message, data);
};

ServerLog.prototype.serverStart = function () {
    this.util.log('info', 'Server started.');
};

ServerLog.prototype.gameStart = function (players) {
    this.util.log('info', 'Game started. Players : ' + players.join(', '));
};

ServerLog.prototype.gameEnd = function (player) {
    this.util.log('info', 'Game ended. Winner : ' + player);
};

ServerLog.prototype.playerConnection = function (id) {
    this.util.log('info', 'New player has connected: ' + id);
};

ServerLog.prototype.playerDisconnection = function (id) {
    this.util.log('info', 'Player has disconnected: ' + id);
};

ServerLog.prototype.playerNotFound = function (id) {
    this.util.log('error', 'Player not found: ' + id);
};

if (typeof module !== 'undefined') {
    module.exports = ServerLog;
}