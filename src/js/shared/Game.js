function Game() {
    this.players = [];
    this.gameRunning = false;
    this.gamePaused = false;
    this.timer = 0;
    this.drawer = null;
    this.collisionInFrame = false;
}

Game.prototype.init = function () {
    this.initDisplay();
    this.initPlayers();
};

Game.prototype.initDisplay = function () {
    this.drawer.init();
};

Game.prototype.initPlayers = function () {
    for (var i = 0; i < this.players.length; i++) {
        this.players[i].init();
    }
};

Game.prototype.addPlayer = function (name, color, id) {
    var newPlayer = new Player(name, color, id);
    newPlayer.game = this;
    this.players.push(newPlayer);

};

Game.prototype.removePlayer = function (id) {
    var playerToRemoved = this.getPlayer(id);
    if (playerToRemoved) {
        this.players.splice(this.players.indexOf(playerToRemoved), 1);
    }
};

Game.prototype.getPlayer = function (id) {
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].id == id) {
            return this.players[i];
        }
    }
    return false;
};

Game.prototype.getPlayersOrdered = function () {
    var playersOrdered = cloneArray(this.players);
    playersOrdered.sort(function (a, b) {
        return b.score - a.score;
    });
    return playersOrdered;
};

Game.prototype.run = function () {
    this.timer = 0;
    this.init();
    this.gamePaused = false;
    this.gameRunning = true;
};

Game.prototype.pause = function () {
    this.gamePaused = !this.gamePaused;
};

Game.prototype.update = function (delta) {
    this.collisionInFrame = false;
    if ((this.gameRunning) && (!this.gamePaused)) {
        for (var i = 0; i < this.players.length; i++) {
            if (!this.players[i].collisionsCheck) {
                this.players[i].update(delta);
                if (this.players[i].collisionsCheck) {
                    this.collisionInFrame = true;
                    this.incrementPlayersScores();
                    if (this.isRoundFinished()) {
                        this.gameRunning = false;
                        break;
                    }
                }
            }
        }
        this.timer++;
    }
};

Game.prototype.incrementPlayersScores = function () {
    for (var i = 0; i < this.players.length; i++) {
        if (!this.players[i].collisionsCheck) {
            this.players[i].score++;
        }
    }
};

Game.prototype.isRoundFinished = function () {
    var playersOut = 0;
    for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].collisionsCheck) {
            playersOut++;
        }
    }
    if (playersOut >= (this.players.length - 1)) {
        return true;
    }
    return false;
};

Game.prototype.draw = function (interpolationPercentage) {
    if ((this.gameRunning) && (!this.gamePaused)) {
        this.drawer.init();
        for(var i = 0; i < this.players.length; i++) {
            this.players[i].draw(this.timer);
        }
    }
};

if (typeof module != 'undefined') {
    module.exports = Game;
}
if (typeof require != 'undefined') {
    var Player = require("./Player");
}