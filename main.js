// Adapted from Code Your First Game by Chris DeLeon
//-----------------------------------------------------------------------------
// Constants
const BACKGROUND_COLOR = 'black';

const PADDLE_COLOR = 'white';
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

const BALL_COLOR = 'white';
const BALL_RADIUS = 10;

const AI_SPEED = 10;

const SCORE_COLOR = 'white';
const WINNING_SCORE = 3;

const FPS = 30;

//-----------------------------------------------------------------------------
// Globals

// canvas
var canvas;
var canvasContext;

var showWinningScreen = false;

// player
var Player = function Player() {
    this.score = 0;
    this.paddleY = 250;
}

var player1 = new Player();
var player2 = new Player();

// ball
var ball = {
    x : 50,
    y : 50,
    dx : 10,
    dy : 4
}

//-----------------------------------------------------------------------------
// Entry
window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    setInterval(function() {
        draw();
        move();
    }, 1000/FPS);

    // mouse click for continuing after game over
    canvas.addEventListener('mousedown', function(event) {
        if (showWinningScreen) {
            player1.score = 0;
            player2.score = 0;
            showWinningScreen = false;
        }
    });

    // logic for moving player paddle with mouse
    canvas.addEventListener('mousemove', function(event) {
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mouseX = event.clientX - rect.left - root.scrollLeft;
        var mouseY = event.clientY - rect.top - root.scrollTop;
        player1.paddleY = mouseY - (PADDLE_HEIGHT/2);
    });
}

//-----------------------------------------------------------------------------
var draw = function() {
    var colorRect = function(leftX, topY, width, height, drawColor) {
        canvasContext.fillStyle = drawColor;
        canvasContext.fillRect(leftX, topY, width, height);
    }

    var colorCircle = function(centerX, centerY, radius, drawColor) {
        canvasContext.fillStyle = drawColor;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        canvasContext.fill();
    }

    colorRect(0, 0, canvas.width, canvas.height, 'black');

    // scores
    canvasContext.fillStyle = 'white'
    canvasContext.fillText(player1.score, 100, 100);
    canvasContext.fillText(player2.score, canvas.width - 100, 100);

    if (showWinningScreen) {
        canvasContext.fillStyle = 'white'
        canvasContext.fillText('click to continue...', 350, 500);
        if (player1.score >= WINNING_SCORE) {
            canvasContext.fillText("You Won!", 350, 200);
        }
        else if (player2.score >= WINNING_SCORE) {
            canvasContext.fillText("You Lost!", 350, 200);
        }
        return;
    }

    // paddles
    colorRect(0, player1.paddleY, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    colorRect(canvas.width - PADDLE_THICKNESS, player2.paddleY,
            PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

    // net
    for (var i=10; i < canvas.height; i+=40) {
        colorRect(canvas.width/2 - 1, i, 2, 20, 'white');
    }

    // ball
    colorCircle(ball.x, ball.y, BALL_RADIUS, 'white');
}

//-----------------------------------------------------------------------------
var move = function() {
    function ballReset() {
        if (player1.score >= WINNING_SCORE || player2.score >= WINNING_SCORE) {
            showWinningScreen = true;
        }

        ball.dx *= -1;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }

    var aiMovement = function() {

        var paddle2YCenter = player2.paddleY + (PADDLE_HEIGHT/2);
        if (paddle2YCenter < ball.y - 35) {
            player2.paddleY += AI_SPEED;
        }
        else if (paddle2YCenter > ball.y + 35) {
            player2.paddleY -=AI_SPEED;
        }
    }

    if (showWinningScreen) {
        return;
    }

    aiMovement();

    ball.x += ball.dx;
    ball.y += ball.dy;
    
    if (ball.x < 0) {
        if (ball.y > player1.paddleY &&
            ball.y < player1.paddleY + PADDLE_HEIGHT) {

            ball.dx *= -1;
            var deltaY = ball.y - (player1.paddleY + PADDLE_HEIGHT/2);
            ball.dy = deltaY * 0.35;
            return;
        }
        player2.score++;
        ballReset();
    }
    else if (ball.x > canvas.width) {
        if (ball.y > player2.paddleY && 
            ball.y < player2.paddleY + PADDLE_HEIGHT) {

            ball.dx *= -1;
            var deltaY = ball.y - (player2.paddleY + PADDLE_HEIGHT/2);
            ball.dy = deltaY * 0.35;
            return;
        }
        player1.score++; 
        ballReset();
    }

    if (ball.y < 0 || ball.y > canvas.height) {
        ball.dy *= -1; 
    }
}

//-----------------------------------------------------------------------------
