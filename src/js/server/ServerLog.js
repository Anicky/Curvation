function ServerLog(util) {
    this.util = util;
}

ServerLog.prototype.serverStart = function () {
    this.util.log("info", "Server started.");
};

ServerLog.prototype.gameStart = function () {
    this.util.log("info", "Game started.");
};

ServerLog.prototype.gameEnd = function () {
    this.util.log("info", "Game ended.");
};

ServerLog.prototype.playerConnection = function (id) {
    this.util.log("info", "New player has connected: " + id);
};

ServerLog.prototype.playerDisconnection = function (id) {
    this.util.log("info", "Player has disconnected: " + id);
};

ServerLog.prototype.playerNotFound = function (id) {
    this.util.log("error", "Player not found: " + id);
};

if (typeof module != 'undefined') {
    module.exports = ServerLog;
}