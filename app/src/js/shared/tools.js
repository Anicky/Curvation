/**
 * La première dimension du tableau correspond aux numéros des joueurs.
 * La deuxième dimension correspond aux touches assignés pour la gauche (index 0) et pour la droite (index 1)
 * KeyCodes : 37 = LEFT, 39 = RIGHT, 83 = S, 68 = D, G = 71, H = 72, L = 76, M = 77
 */
KEY_CODES = [[37, 39], [83, 68], [71, 72], [76, 77]];
PLAYER_COLORS = ['#D62525', '#2D70EA', '#396F19', '#F1BC42'];

GAME_MODE_LOCAL = 1;
GAME_MODE_ONLINE = 2;

DEFAULT_SNAKE_SIZE = 5;
DEFAULT_SNAKE_SPEED = 15 / 100;
DEFAULT_SNAKE_CURVE = 3;

DEFAULT_BEGIN_PADDING = 30;
DEFAULT_WAITING_TIME = 100;
DEFAULT_NO_COLLISIONS_TIME = 100;

DEFAULT_SNAKE_HOLE_SIZE_MIN = 8;
DEFAULT_SNAKE_HOLE_SIZE_MAX = 16;
DEFAULT_SNAKE_HOLE_MINIMUM_TIME = 20;
DEFAULT_SNAKE_HOLE_PROBABILITY = 1;

DEFAULT_SNAKE_ARROW_SPACE = 10;
DEFAULT_SNAKE_ARROW_SIZE = 50;
DEFAULT_SNAKE_ARROW_HEADSIZE = 25;

MAP_SIZE = 1000;

function setRandomX() {
    return Math.floor(Math.random() * (1000 - DEFAULT_BEGIN_PADDING * 2 + 1)) + DEFAULT_BEGIN_PADDING;
}

function setRandomY() {
    return Math.floor(Math.random() * (1000 - DEFAULT_BEGIN_PADDING * 2 + 1)) + DEFAULT_BEGIN_PADDING;
}

function setRandomAngle() {
    return Math.random() * (2 * Math.PI);
}

function setRandomHoleSize() {
    return Math.floor(Math.random() * (DEFAULT_SNAKE_HOLE_SIZE_MAX - DEFAULT_SNAKE_HOLE_SIZE_MIN + 1)) + DEFAULT_SNAKE_HOLE_SIZE_MIN;
}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function cloneArray(array) {
    return array.slice(0);
}