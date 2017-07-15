class ServerLog {

    public util;

    public constructor(util) {
        this.util = util;
    }

    public writeLog(message, type, data) {
        if (!data || typeof data !== 'undefined') {
            this.util.log(type, message);
        } else {
            this.util.log(type, message, data);
        }
    };

    public writeDebugLog(message, data) {
        this.writeLog('debug', message, data);
    };

    public writeInfoLog(message, data) {
        this.writeLog('info', message, data);
    };

    public writeErrorLog(message, data) {
        this.writeLog('error', message, data);
    };

    public serverStart() {
        this.util.log('info', 'Server started.');
    };

    public gameStart(players) {
        this.util.log('info', 'Game started. Players : ' + players.join(', '));
    };

    public gameEnd(player) {
        this.util.log('info', 'Game ended. Winner : ' + player);
    };

    public playerConnection(id) {
        this.util.log('info', 'New player has connected: ' + id);
    };

    public playerDisconnection(id) {
        this.util.log('info', 'Player has disconnected: ' + id);
    };

    public playerNotFound(id) {
        this.util.log('error', 'Player not found: ' + id);
    };

}

export = ServerLog;