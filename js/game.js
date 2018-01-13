var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballspeedX = 10;
var ballspeedY = 4;

var paddle1Y = 250;
var paddle2Y = 250;
const PADLE_HEIGHT = 100;
const PADLE_THICKNESS = 10;

var player1Score = 0;
var player2Score = 0;
const WINNIG_SCORE = 3;

var WinScreen  = false;


// funtion for getting mouse position
function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };

}

function handleMouseClick(evt){
         if(WinScreen){
             player1Score = 0;
             player2Score = 0;
             WinScreen = false;
         }
}

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");

    var fps = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000 / fps);

    //event listner when mouse moves
    canvas.addEventListener("mousemove",
        function(evt) {
            var mousePos = calculateMousePos(evt);
            // making the cursor to point at the middle of the paddle
            paddle1Y = mousePos.y - (PADLE_HEIGHT / 2);
        }

    );

    canvas.addEventListener("mousedown",handleMouseClick);
};

function ballReset() {
    if(player1Score >= WINNIG_SCORE || player2Score >= WINNIG_SCORE){
        WinScreen = true;
    }
    ballspeedX = -ballspeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

// computerMovement funtion for right paddle

function computerMovement() {

    var paddleCenter = paddle2Y + (PADLE_HEIGHT / 2);

    if (paddleCenter < ballY - 35) {
        paddle2Y += 6;
    } else if (paddleCenter > ballY + 35) {
        paddle2Y -= 6;
    }
}

function moveEverything() {
    if(WinScreen){
        return;
    }
    computerMovement();

    ballX = ballX + ballspeedX;
    ballY = ballY + ballspeedY;

    // for bouncing the ball from left paddle
    if (ballX >= canvas.width) {
        if (ballY < paddle2Y + PADLE_HEIGHT && ballY > paddle2Y) {
            ballspeedX = -ballspeedX;

            var delta2Y = ballY - (paddle2Y + (PADLE_HEIGHT / 2));
            ballspeedY = delta2Y * 0.35;
        } else {
            player1Score += 1; // must be before the ballReset().
            ballReset();

        }
    }
    // for bouncing the ball from right paddle
    if (ballX <= 0) {

        if (ballY < paddle1Y + PADLE_HEIGHT && ballY > paddle1Y) {
            ballspeedX = -ballspeedX;

            // when the ball hit above the center give it upward angle and speed and vise versa.
            // when it hit center the net valuse will be 0 and the ball will move horizontal.
            var delta1Y = ballY - (paddle1Y + (PADLE_HEIGHT / 2));
            ballspeedY = delta1Y * 0.35;

        } else {
            player2Score += 1; // must be before the ballReset().
            ballReset();

        }
    }

    // check for vertical mpvement

    if (ballY >= canvas.height) {
        ballspeedY = -ballspeedY;
    }
    if (ballY <= 0) {
        ballspeedY = -ballspeedY;
    }

}

// draw net
function drawNet(){
    for(i = 0; i < canvas.height; i+=40){
        colorRect(canvas.width/2 - 1,i,2,20,"white");
    }
}
function drawEverything() {
    // drwaing black canvas
    colorRect(0, 0, canvas.width, canvas.height, "black");
    drawNet();
// stop the everyting when one player win. if WinScreen is true means either player score
// is 3 WinScreen will turn to true and the below statement will execute.
    if(WinScreen){
        // if one player wins draw win score on the the screen
        if(player1Score >= WINNIG_SCORE){
            canvasContext.fillStyle = 'white';
            canvasContext.fillText('You Won !', 350, 250);
        } else if(player2Score >= WINNIG_SCORE){
            canvasContext.fillStyle = 'white';
            canvasContext.fillText('Computer Won !', 350, 250);
        }
        canvasContext.fillStyle = 'white';
        canvasContext.fillText('Click To continue', 350, 500);
        return; // when the condition is true return will exit this draw function.
    }

    // the next line draw left paddle
    colorRect(0, paddle1Y, PADLE_THICKNESS, PADLE_HEIGHT, "white");

    // the next line draw right paddle
    colorRect(canvas.width - PADLE_THICKNESS, paddle2Y, PADLE_THICKNESS, PADLE_HEIGHT, "white");

    // the next line draw a ball
    colorCircle(ballX, ballY, 10, "white");

    //text on the canvas
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}
// function for drawing rectangles
function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

// function for drawing cirles
function colorCircle(Cx, Cy, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(Cx, Cy, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}
