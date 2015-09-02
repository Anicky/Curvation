var Game = function () {
    this.players = [];
    this.gameLaunched = false;
    this.gamePaused = false;
    this.gameRunning = true;

    var addPlayer = function(player) {
        this.players.push(player);
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
                    $('#gameover .modal-body').html('<p style="color:' + this.players[0].color + '">Game over !</p>');
                } else {
                    var winner = null;
                    for (i = 0; i < this.players.length; i++) {
                        if (!this.players[i].collisionsCheck) {
                            winner = this.players[i];
                            break;
                        }
                    }
                    $('#gameover .modal-body').html('<p style="color:' + winner.color + '"><span class="modal-playername">' + winner.name + '</span> wins !</p>');
                }
                $('#gameover').modal('show');
                var that = this;
                setTimeout(function () {
                    $('#gameover').modal('hide');
                    that.init();
                }, 2000);
            }
            timer++;
        }
    };

    var draw = function (interpolationPercentage) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].draw(interpolationPercentage);
        }
    };

    var end = function (fps, panic) {
        if (panic) {
            var discardedTime = Math.round(MainLoop.resetFrameDelta());
            console.warn('Main loop panicked, probably because the browser tab was put in the background. Discarding ' + discardedTime + 'ms');
        }
    };

    var init = function () {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].init();
        }
        this.gameRunning = true;
        timer = 0;
    };

    return {
        players: this.players,
        gameLaunched: this.gameLaunched,
        gameRunning: this.gameRunning,
        gamePaused: this.gamePaused,
        addPlayer: addPlayer,
        update: update,
        draw: draw,
        end: end,
        init: init
    };
};

if (typeof exports != 'undefined') {
    exports.Game = Game;
}