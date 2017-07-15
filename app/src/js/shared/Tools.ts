class Tools {

    /**
     * La première dimension du tableau correspond aux numéros des joueurs.
     * La deuxième dimension correspond aux touches assignés pour la gauche (index 0) et pour la droite (index 1)
     * KeyCodes : 37 = LEFT, 39 = RIGHT, 83 = S, 68 = D, G = 71, H = 72, L = 76, M = 77
     */
    public static KEY_CODES = [[37, 39], [83, 68], [71, 72], [76, 77]];
    public static PLAYER_COLORS = ['#D62525', '#2D70EA', '#396F19', '#F1BC42'];

    public static GAME_MODE_LOCAL = 1;
    public static GAME_MODE_ONLINE = 2;

    public static DEFAULT_SNAKE_SIZE = 5;
    public static DEFAULT_SNAKE_SPEED = 3;
    public static DEFAULT_SNAKE_CURVE = 3;

    public static DEFAULT_BEGIN_PADDING = 30;
    public static DEFAULT_WAITING_TIME = 100 /** (FPS_MAX / FPS_INTENDED)*/;
    public static DEFAULT_NO_COLLISIONS_TIME = 100 /** (FPS_MAX / FPS_INTENDED)*/;

    public static DEFAULT_SNAKE_HOLE_SIZE_MIN = 8;
    public static DEFAULT_SNAKE_HOLE_SIZE_MAX = 16;
    public static DEFAULT_SNAKE_HOLE_MINIMUM_TIME = 20;
    public static DEFAULT_SNAKE_HOLE_PROBABILITY = 1;

    public static DEFAULT_SNAKE_ARROW_SPACE = 10;
    public static DEFAULT_SNAKE_ARROW_SIZE = 50;
    public static DEFAULT_SNAKE_ARROW_HEADSIZE = 25;

    public static MAP_SIZE = 1000;

    public static setRandomX() {
        return Math.floor(Math.random() * (1000 - Tools.DEFAULT_BEGIN_PADDING * 2 + 1)) + Tools.DEFAULT_BEGIN_PADDING;
    }

    public static setRandomY() {
        return Math.floor(Math.random() * (1000 - Tools.DEFAULT_BEGIN_PADDING * 2 + 1)) + Tools.DEFAULT_BEGIN_PADDING;
    }

    public static setRandomAngle() {
        return Math.random() * (2 * Math.PI);
    }

    public static setRandomHoleSize() {
        return Math.floor(Math.random() * (Tools.DEFAULT_SNAKE_HOLE_SIZE_MAX - Tools.DEFAULT_SNAKE_HOLE_SIZE_MIN + 1)) + Tools.DEFAULT_SNAKE_HOLE_SIZE_MIN;
    }

    public static round(value, decimals) {
        return value.toFixed(decimals);
    }

    public static cloneArray(array) {
        return array.slice(0);
    }
}

export = Tools;