// @TODO : Gerer trous en online (seulement cote serveur avec notif aux joueurs quand ca arrive)

import Player = require('./Player');
import Drawer = require('./Drawer');
import Tools = require('./Tools');

class Game {

    public fpsMax;
    public fpsIntended;
    public frametimeMax;
    public mode = null;
    public drawer = null;
    public players = [];
    public gameRunning = false;
    public gamePaused = false;
    public timer = 0;
    public collisionInFrame = false;
    public currentPlayerId = null;
    public server = false; //FIX
    public lastFrameTime = 1000 / this.fpsIntended;
    public deltaTime = 0;
    public updateId;

    constructor(fpsMax, fpsIntended) {
        this.fpsMax = fpsMax;
        this.fpsIntended = fpsIntended;
        this.frametimeMax = 1000 / this.fpsMax
    }

    public init() {
        this.timer = 0;
        this.initDisplay();
        this.initPlayers();
    };

    public setRandomPositions() {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].setRandomPosition();
        }
    };

    public initDisplay() {
        this.drawer.init();
    };

    public initPlayers() {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].init();
        }
    };

    public addPlayer(name, color, id) {
        this.players.push(new Player(this, name, color, id));
    };

    public removePlayer(id) {
        var player = this.getPlayer(id);
        if (player) {
            this.players.splice(this.players.indexOf(player), 1);
        }
    };

    public getPlayer(id) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].id === id) {
                return this.players[i];
            }
        }
        return false;
    };

    public getPlayersOrdered() {
        var playersOrdered = Tools.cloneArray(this.players);
        playersOrdered.sort(function (a, b) {
            return b.score - a.score;
        });
        return playersOrdered;
    };

    public run() {
        this.init();
        this.gamePaused = false;
        this.gameRunning = true;
        this.update(this.lastFrameTime);
    };

    public pause() {
        this.gamePaused = !this.gamePaused;
    };

    public update(frameTime) {
        this.deltaTime = frameTime - this.lastFrameTime;
        this.lastFrameTime = frameTime;
        this.collisionInFrame = false;
        if ((this.gameRunning) && (!this.gamePaused)) {
            for (var i = 0; i < this.players.length; i++) {
                if (!this.players[i].collisionsCheck) {
                    this.players[i].update(this.deltaTime);
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
        this.updateId = window.requestAnimationFrame(this.update.bind(this));
        if (!this.server) {
            this.clientUpdate();
        }
    };

    public clientUpdate() {
        this.draw();
    };

    public incrementPlayersScores() {
        for (var i = 0; i < this.players.length; i++) {
            if (!this.players[i].collisionsCheck) {
                this.players[i].score++;
            }
        }
    };

    public isRoundFinished() {
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

    public draw() {
        if ((this.gameRunning) && (!this.gamePaused)) {
            this.drawer.init();
            for (var i = 0; i < this.players.length; i++) {
                this.players[i].draw(this.timer);
            }
        }
    };


}

export = Game;