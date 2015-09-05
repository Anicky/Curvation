function Game() {
    this.players = [];
    this.gameRunning = false;
    this.gamePaused = false;
    this.timer = 0;
    this.display = null;
}

Game.prototype.init = function () {
    this.initDisplay();
    this.initPlayers();
};

Game.prototype.initDisplay = function () {
    this.display.init();
};

Game.prototype.initPlayers = function () {
    for (var i = 0; i < this.players.length; i++) {
        this.players[i].init();
    }
};

Game.prototype.addPlayer = function (name, color) {
    var newPlayer = new Player(name, color);
    newPlayer.game = this;
    this.players.push(newPlayer);

};

Game.prototype.removePlayer = function (id) {
    var playerToRemoved = getPlayer(id);
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
    var playersOrdered = this.players.slice(0);
    playersOrdered.sort(function (a, b) {
        return b.score - a.score;
    });
    return playersOrdered;
};

Game.prototype.run = function () {
    this.timer = 0;
    this.init();
    this.gameRunning = true;
};

Game.prototype.pause = function () {
    this.gamePaused = !this.gamePaused;
};

Game.prototype.update = function (delta) {
    if ((this.gameRunning) && (!this.gamePaused)) {
        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (!player.collisionsCheck) {
                player.update(delta);
                if (player.collisionsCheck) {
                    var playersLost = 0;
                    for (var j = 0; j < this.players.length; j++) {
                        if (!this.players[j].collisionsCheck) {
                            this.players[j].score++;
                        } else {
                            playersLost++;
                        }
                    }
                    if ((this.players.length === 1) || playersLost === this.players.length - 1) {
                        this.gameRunning = false;
                        break;
                    }
                }
            }
        }
        this.timer++;
    }
};

Game.prototype.draw = function (interpolationPercentage) {
    if ((this.gameRunning) && (!this.gamePaused)) {
        var entities = [];
        entities = entities.concat(this.getPlayerPoints());
        entities = entities.concat(this.getPlayerArrows());
        this.display.draw(entities);
    }
};

Game.prototype.getPlayerPoints = function () {
    var entities = [];
    for (var i = 0; i < this.players.length; i++) {
        entities = entities.concat(this.players[i].history);
    }
    return entities;
};

Game.prototype.getPlayerArrows = function () {
    var entities = [];
    if (this.timer < DEFAULT_WAITING_TIME) {
        for (var i = 0; i < this.players.length; i++) {
            entities = entities.concat(this.players[i].getArrow());
        }
    }
    return entities;
};

if (typeof module != 'undefined') {
    module.exports = Game;
}