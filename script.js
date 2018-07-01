/* jshint browser: true */
/* jshint -W097 */

"use strict";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 10;
var ballColor = getRandomRgb();
var dx = 2;
var dy = -2;

var paddleHeight = 10;
var paddleWidth = 100;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleY = (canvas.height - paddleHeight);
var paddleColor = getRandomRgb();

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickColor = getRandomRgb();

var score = 0;
var scoreColor = getRandomRgb();

var lives = 3;
var livesColor = getRandomRgb();

var bricks = [];
for (var r = 0; r < brickRowCount; r++) {
  bricks[r] = [];
  for (var c = 0; c < brickColumnCount; c++) {
    bricks[r][c] = {
      x: 0,
      y: 0,
      status: 1,
    };
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  }
  if (e.keyCode === 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  }
  if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function collisionDetection() {
  for (var r = 0; r < brickRowCount; r++) {
    for (var c = 0; c < brickColumnCount; c++) {
      var b = bricks[r][c];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          ballColor = getRandomRgb();
          score++;
          if (score === brickColumnCount * brickRowCount) {
            alert('You win!');
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = livesColor;
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = scoreColor;
  ctx.fillText("Score: " + score, 8, 20);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, 2 * Math.PI);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (var r = 0; r < brickRowCount; r++) {
    for (var c = 0; c < brickColumnCount; c++) {
      if (bricks[r][c].status === 1) {
        var brickX = (c * (brickWidth + brickPadding) + brickOffsetLeft);
        var brickY = (r * (brickHeight + brickPadding) + brickOffsetTop);
        bricks[r][c].x = brickX;
        bricks[r][c].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = brickColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawBricks();

  collisionDetection();

  x += dx;
  y += dy;

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (lives === 0) {
        alert("Game Over");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  requestAnimationFrame(draw);
}

function getRandomRgb() {
  var scale = 190;
  var r = parseInt(Math.random() * scale);
  var g = parseInt(Math.random() * scale);
  var b = parseInt(Math.random() * scale);
  var rgb = "rgb(" + r + ", " + g + ", " + b + ")";
  return rgb;
}

draw();
