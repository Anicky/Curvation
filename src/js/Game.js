function Game() {
    this.players = [];
    this.gameLaunched = false;
    this.gameRunning = false;
    this.gamePaused = false;
    this.timer = 0;
    this.display = null;
}

Game.prototype.init = function () {
    this.display.init();
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
    this.init();
    this.timer = 0;
    this.gameLaunched = true;
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
                    updateScoresTable();
                    if ((this.players.length === 1) || playersLost === this.players.length - 1) {
                        this.gameRunning = false;
                        break;
                    }
                }
            }
        }
        if (!this.gameRunning) {
            if (this.players.length === 1) {
                // @TODO : move this code
                $('#gameover .modal-body').html('<p style="color:' + this.players[0].color + '">Game over !</p>');
            } else {
                var winner = null;
                for (i = 0; i < this.players.length; i++) {
                    if (!this.players[i].collisionsCheck) {
                        winner = this.players[i];
                        break;
                    }
                }
                // @TODO : move this code
                $('#gameover .modal-body').html('<p style="color:' + winner.color + '"><span class="modal-playername">' + winner.name + '</span> wins !</p>');
            }
            // @TODO : move this code
            $('#gameover').modal('show');
            setTimeout(function () {
                $('#gameover').modal('hide');
                this.run();
            }, 2000);
        }
        this.timer++;
    }
};

Game.prototype.draw = function (interpolationPercentage) {
    var entities = [];
    for (var i = 0; i < this.players.length; i++) {
        entities = entities.concat(this.players[i].history);
    }
    this.display.draw(entities);
};

if (typeof module != 'undefined') {
    module.exports = Game;
}