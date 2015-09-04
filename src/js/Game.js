var Game = function () {
    this.players = [];
    this.gameLaunched = false;
    this.gameRunning = false;
    this.gamePaused = false;
    this.timer = 0;
    this.display = null;

    var init = function () {
        this.display.init();
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].init();
        }
    };

    var addPlayer = function (name, color) {
        var newPlayer = new Player(name, color);
        newPlayer.game = this;
        this.players.push(newPlayer);

    };

    var removePlayer = function (id) {
        var playerToRemoved = getPlayer(id);
        if (playerToRemoved) {
            this.players.splice(this.players.indexOf(playerToRemoved), 1);
        }
    };

    var getPlayer = function (id) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id == id) {
                return this.players[i];
            }
        }
        return false;
    };

    var getPlayersOrdered = function () {
        var playersOrdered = this.players.slice(0);
        playersOrdered.sort(function (a, b) {
            return b.score - a.score;
        });
        return playersOrdered;
    };

    var run = function () {
        this.init();
        this.timer = 0;
        this.gameLaunched = true;
        this.gameRunning = true;
    };

    var pause = function () {
        this.gamePaused = !this.gamePaused;
    };

    var update = function (delta) {
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

    var draw = function (interpolationPercentage) {
        this.display.draw(this, interpolationPercentage);
    };

    return {
        players: this.players,
        gameLaunched: this.gameLaunched,
        gameRunning: this.gameRunning,
        gamePaused: this.gamePaused,
        timer: this.timer,
        display: this.display,
        init: init,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        getPlayer: getPlayer,
        getPlayersOrdered: getPlayersOrdered,
        run: run,
        pause: pause,
        update: update,
        draw: draw
    };
};

if (typeof exports != 'undefined') {
    exports.Game = Game;
}