const KEY_LEFT = 37;
const KEY_RIGHT = 39;

var players = new Array();
var canvas = null;
var context = null;
var key_pressed_left = 0;
var key_pressed_right = 0;
var game_running = true;
var snake_size = 3;
var snake_speed = 2;
var snake_curve = 3;

function Player(name, color, x, y) {
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
    this.direction = 1;
}

function updateCanvas() {
    var collisions_check = false;
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        var dX = Math.cos(p.direction) * snake_speed;
        var dY = Math.sin(p.direction) * snake_speed;
        p.x += dX;
        p.y += dY;
        var tempX = p.x;
        var tempY = p.y;
        checkKey();
        tempX += Math.cos(p.direction) * snake_size;
        tempY += Math.sin(p.direction) * snake_size;
        context.fillStyle = p.color;
        collisions_check = checkCollisions(p, tempX, tempY);
        context.beginPath();
        context.arc(p.x, p.y, snake_size, 0, 2 * Math.PI);
        context.fill();
    }
    if (collisions_check) {
        $('#gameover').modal('show');
    }
    return collisions_check;
}

function checkCollisions(p, tempX, tempY) {
    var pixelData = context.getImageData(tempX, tempY, 1, 1);
    if (p.x <= 0 || p.x >= canvas.width || p.y <= 0 || p.y >= canvas.height || (pixelData.data[3] > 0)) {
        return true;
    }
    return false;
}

function refresh() {
    setTimeout(function () {
        game_running = updateCanvas();
        if (!game_running) {
            refresh();
        }
    }, 10);
}

$(document).ready(function () {
    canvas = document.getElementById('game');
    canvas.width = $('.panel-body').width();
	canvas.height = $('.panel-body').height();
    context = canvas.getContext("2d");
	
	// Position aléatoire
	random_x = Math.floor(Math.random() * canvas.width - 30) + 1;
	random_y = Math.floor(Math.random() * canvas.height - 30) + 1;
	
    players.push(new Player("Jérémie", 'pink', random_x, random_y));
    $(this).keydown(function (e) {
        e.preventDefault();
        if (e.keyCode == KEY_LEFT) {
            key_pressed_left = 1;
        }
        else if (e.keyCode == KEY_RIGHT) {
            key_pressed_right = 1;
        }
    });
    $(this).keyup(function (e) {
        e.preventDefault();
        if (e.keyCode == KEY_LEFT) {
            key_pressed_left = 0;
        }
        else if (e.keyCode == KEY_RIGHT) {
            key_pressed_right = 0;
        }
    });
    refresh();
    $('#retry').click(function () {
        retry();
    });
});

function retry() {
    $('#gameover').modal('hide');
    context.clearRect(0, 0, canvas.width, canvas.height);
	// Position aléatoire
	random_x = Math.floor(Math.random() * canvas.width - 30) + 1;
	random_y = Math.floor(Math.random() * canvas.height - 30) + 1;
    players[0].x = random_x;
    players[0].y = random_y;
    players[0].direction = 1;
    game_running = true;
    refresh();
}


function checkKey() {
    if (key_pressed_left) {
        players[0].direction -= snake_curve * (Math.PI / 180);
    }
    else if (key_pressed_right) {
        players[0].direction += snake_curve * (Math.PI / 180);
    }
}
