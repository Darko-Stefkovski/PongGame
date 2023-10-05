var canvas;
var canvasContext;
var ballX = 50; // start the x axis with 50
var ballSpeedX = 10;
var ballY = 50; // start the y axis with 50
var ballSpeedY = 4;
//player 1
var paddle1Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
//player AI
var paddle2Y = 250;
//Score players
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 10;
//Win screen
var showingWinScreen = false;
//Mouse position
function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };
}

console.log("Code is running");


function  handleMouseClick(evt) {
    if(showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

window.onload = function() {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);
     // Set the font size and family for the score numbers here
     canvasContext.font = "50px Arial";
     canvasContext.fillStyle = "white";
    //Mouse movment
    canvas.addEventListener('mousemove', 
        function(evt) {
            var mousePos = calculateMousePos(evt);
            //Player 1 or 2
            paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
        })
    canvas.addEventListener('mousedown', handleMouseClick)
        
    var rangeInput = document.getElementById("customRange1");

rangeInput.addEventListener("input", function(event) {
    // Get the current value of the range input (0 to 100)
    var rangeValue = parseInt(event.target.value);

    // Reverse the range value (100 - rangeValue) and convert it to the corresponding paddle position
    // Assuming paddle1Y can vary between 0 and canvas.height - PADDLE_HEIGHT
    paddle1Y = (canvas.height - PADDLE_HEIGHT) * ((100 - rangeValue) / 100);

    // Redraw the canvas to reflect the updated paddle position
    drawEverything();
});

}
//When eather player wins
function ballReset() {
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = true;
    }
     ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMovment() {
    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2)
    if (paddle2YCenter < ballY-35) {
        paddle2Y += 6;
    } else if(paddle2YCenter > ballY+35) {
        paddle2Y -= 6;
    }
}

function moveEverything() {
    if (showingWinScreen) {
        return;
    }
    computerMovment();

    //add 5px to the x axis 
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0) {
        if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY
                -(paddle1Y+PADDLE_HEIGHT/2);
                ballSpeedY = deltaY * 0.35;

        } else {
            player2Score++; //ads a score + 1// must be BEFORE ballReset()
            ballReset();
        }
    }
    if (ballX > canvas.width) {
        //ballSpeedX = -ballSpeedX;
        if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY
            -(paddle2Y+PADDLE_HEIGHT/2);
            ballSpeedY = deltaY * 0.35;

        } else {
            player1Score++; //ads a score + 1// must be BEFORE ballReset()
            ballReset();
        }
    }
    //Y axis
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    
}

function drawNet() {
    for(var i=0; i <canvas.height; i+=40) {
        colorRect(canvas.width/2-1,i,2,20,'white');
    }
}

function drawEverything() {
    //console.log(ballX)
    // next line blanks out the screen with black
    colorRect(0, 0, canvas.width, canvas.height, 'black');


    if (showingWinScreen) {
        canvasContext.fillStyle ='white';
        
        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Left Player Won!", 350,200);
        } else if (player2Score >= WINNING_SCORE) {
            canvasContext.fillText("Right Player Won!", 350,200);
        }
        
        
        canvasContext.font = "30px Arial"; // Set the font size and family
        canvasContext.fillStyle = "white"; // Set the text color
        canvasContext.fillText("Click to continue", 350, 500); // Draw the text
        
        
        return;
        
    }
    drawNet();

    // this is left player paddle
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT,'white');
     // this is right player paddle AI
     colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, 10, PADDLE_HEIGHT,'white');
    // this line draws the ball
   colorCircle(ballX, ballY, 10, 'white')
    //colorRect(ballX, 100, 10, 10,'red');

    canvasContext.fillText(player1Score, 100,100);
    canvasContext.fillText(player2Score, canvas.width-100,100);
}
function colorCircle(centerX,centerY,radius,drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
    canvasContext.fill();
}
function colorRect(leftX,topY,width,height,drawColor) {
    // Fill the canvas with a black background first
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX,topY,width,height);
}