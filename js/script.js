const canvas = document.getElementById('snake');
const ctx = canvas.getContext("2d");
const pixelRatio = window.devicePixelRatio || 1;

// Adjust canvas size for screen
function resizeCanvas() {
    canvas.width = canvas.clientWidth * pixelRatio;
    canvas.height = canvas.clientHeight * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);
}

// Initial resize
resizeCanvas();

// Adaptive resize
window.addEventListener("resize", resizeCanvas)

// Number of cells in each column
const numCells = 18; // Correlates to size of each cell

// Ratio of width:height for accurate cell sizing to fill the screen
let ratio = Math.floor(canvas.width / canvas.height);

// Calculate width and height of each cell
const cellWidth = canvas.clientWidth / (numCells*ratio);
const cellHeight = canvas.clientHeight / numCells;

// Initialise snake and food position
let snake = [{
    x : cellWidth * Math.floor(Math.random() * numCells*ratio),
    y : cellHeight * Math.floor(Math.random() * numCells)
}];
let food = {
    x : cellWidth * Math.floor(Math.random() * numCells*ratio),
    y : cellHeight * Math.floor(Math.random() * numCells)
};

// Display the initial score
const scoreCard = document.getElementById('score');
let score = 0;
scoreCard.innerHTML = "Score: " + score;

let d;

canvas.addEventListener('click', function() {
    canvas.focus();
})

canvas.addEventListener('keydown', direction);

function direction(event) {
    let keypress = event.keyCode;
    // console.log(event.keyCode);
    
    if (keypress == 37 && d != "RIGHT") {
        d = "LEFT";
    }
    else if (keypress == 38 && d != "DOWN") {
        d = "UP";
    }
    else if (keypress == 39 && d != "LEFT") {
        d = "RIGHT";
    }
    else if (keypress == 40 && d != "UP") {
        d = "DOWN";
    }

    // console.log(d);
}

let game = window.setInterval(() => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    // Draw Grid Lines
    // ctx.strokeStyle = "white";
    // for (let x = 0; x < numCells*ratio; x++) {
    //     ctx.beginPath();
    //     ctx.moveTo(x * cellWidth,0);
    //     ctx.lineTo(x * cellWidth, canvas.clientHeight);
    //     ctx.stroke();
    // }
    // for (let y = 0; y < numCells; y++) {
    //     ctx.beginPath();
    //     ctx.moveTo(0, y * cellHeight);
    //     ctx.lineTo(canvas.clientWidth, y * cellHeight);
    //     ctx.stroke();
    // }
    // Draw Snake
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, cellWidth, cellHeight);
        ctx.strokeRect(snake[i].x, snake[i].y, cellWidth, cellHeight);
    }
    // Draw Food
    ctx.strokeStyle = "black";
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, cellWidth, cellHeight);
    ctx.strokeRect(food.x, food.y, cellWidth, cellHeight);

    // Update snake head position based on direction
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // x = LEFT, RIGHT y = UP, DOWN
    if (d == "UP") snakeY -= cellHeight;
    if (d == "DOWN") snakeY += cellHeight;
    if (d == "RIGHT") snakeX += cellWidth;
    if (d == "LEFT") snakeX -= cellWidth;

    console.log("Snake x: " + snakeX + "\n" + "Snake y: " + snakeY);
    // Check for endgame conditions
    if (snakeX < 0 || snakeY < 0 || snakeX >= ((numCells*ratio)*cellWidth) - (numCells/2) || snakeY >= (numCells*cellHeight) - (numCells/2) || headCollision(snakeX, snakeY)) {
        clearInterval(game);
    }

    // Check for Food Collision
    if (Math.abs(snakeX - food.x) < 1 && Math.abs(snakeY - food.y) < 1) {
        score++;
        scoreCard.innerHTML = "Score: " + score;
        // Reposition Food
        food.x = cellWidth * Math.floor(Math.random() * numCells*ratio),
        food.y = cellHeight * Math.floor(Math.random() * numCells)
        updateSnake(snakeX, snakeY, true);
        console.log(snake);
    } 
    else { updateSnake(snakeX, snakeY); }
}, 125);

function headCollision(snakeX, snakeY) {
    for (let i = 1; i < snake.length; i++) {
        if (Math.abs(snakeX - snake[i].x) < 1 && Math.abs(snakeY - snake[i].y) < 1) {
            return true;
        }
    }

    return false;
}

function updateSnake(snakeX, snakeY, eaten = false) {
    let prevX = snakeX;
    let prevY = snakeY;
    for (let i = 0; i < snake.length; i++) {
        let tempX = snake[i].x;
        let tempY = snake[i].y;
        snake[i].x = prevX;
        snake[i].y = prevY;
        prevX = tempX;
        prevY = tempY;
    }
    if (eaten) {
        snake.push({x : prevX, y : prevY});
        eaten = false;
    }
}