const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box, color: "green" }; // Initial head color

let food = createFood();
let foodColor = food.color;
let snackTrail = null; // Store pulled snack position
let direction = "RIGHT";
let isPaused = false;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gamesPlayed = localStorage.getItem("gamesPlayed") || 0;

// Function to set the head color
function setHeadColor(color) {
    snake[0].color = color;
}

// Update score display
function updateScoreDisplay() {
    document.getElementById("score").innerText = `Current Score: ${score}`;
    document.getElementById("highScore").innerText = `All Time High Score: ${highScore}`;
    document.getElementById("gamesPlayed").innerText = `Games Played: ${gamesPlayed}`;
}

// Create food
function createFood() {
    const colors = ["red", "blue", "yellow", "purple", "orange"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box,
        color: color,
    };
}

// Handle input from joystick buttons
function setDirection(newDirection) {
    if ((newDirection === "UP" && direction !== "DOWN") ||
        (newDirection === "DOWN" && direction !== "UP") ||
        (newDirection === "LEFT" && direction !== "RIGHT") ||
        (newDirection === "RIGHT" && direction !== "LEFT")) {
        direction = newDirection;
    }
}

// Check for collision
function checkCollision(head, array) {
    for (let i = 1; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Draw the snake's head as a triangle
function drawHead(snakeHead) {
    ctx.fillStyle = snakeHead.color;
    ctx.beginPath();
    if (direction === "UP") {
        ctx.moveTo(snakeHead.x + box / 2, snakeHead.y);
        ctx.lineTo(snakeHead.x, snakeHead.y + box);
        ctx.lineTo(snakeHead.x + box, snakeHead.y + box);
    } else if (direction === "DOWN") {
        ctx.moveTo(snakeHead.x, snakeHead.y);
        ctx.lineTo(snakeHead.x + box, snakeHead.y);
        ctx.lineTo(snakeHead.x + box / 2, snakeHead.y + box);
    } else if (direction === "LEFT") {
        ctx.moveTo(snakeHead.x + box, snakeHead.y);
        ctx.lineTo(snakeHead.x, snakeHead.y + box / 2);
        ctx.lineTo(snakeHead.x + box, snakeHead.y + box);
    } else {
        ctx.moveTo(snakeHead.x, snakeHead.y);
        ctx.lineTo(snakeHead.x + box, snakeHead.y + box / 2);
        ctx.lineTo(snakeHead.x, snakeHead.y + box);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

// Main game loop
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawHead(snake[0]); // Draw the snake's head

    for (let i = 1; i < snake.length; i++) {
        ctx.fillStyle = snake[i].color;
        ctx.beginPath();
        ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    // Draw the food
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, box, box);

    // Move the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;
    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;

    // Handle boundary conditions
    if (snakeX < 0) snakeX = canvas.width - box;
    else if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    else if (snakeY >= canvas.height) snakeY = 0;

    const newHead = { x: snakeX, y: snakeY, color: snake[0].color };

    if (checkCollision(newHead, snake)) {
        alert("Game Over! The snake collided with itself.");
        gamesPlayed++;
        localStorage.setItem("gamesPlayed", gamesPlayed);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        score = 0;
        snake = [{ x: 9 * box, y: 10 * box, color: "green" }];
        direction = "RIGHT";
        food = createFood();
        foodColor = food.color;
        updateScoreDisplay();
        return;
    }

    // Eat food
    if (snakeX === food.x && snakeY === food.y) {
        snackTrail = { x: snakeX, y: snakeY, color: foodColor }; // Set snackTrail
        food = createFood();
        foodColor = food.color;
    }

    // Update the snake trail if exists
    if (snackTrail) {
        snake.push(snackTrail);
        snackTrail = null;
    } else {
        snake.pop(); // Remove the last segment if no snack is eaten
    }

    snake.unshift(newHead); // Add the new head

    updateScoreDisplay();
}

// Game loop
function gameLoop() {
    if (!isPaused) {
        draw();
    }
}

setInterval(gameLoop, 100);
setInterval(updateScoreDisplay, 1000);

// Digital Joystick UI
document.getElementById("upBtn").addEventListener("click", () => setDirection("UP"));
document.getElementById("downBtn").addEventListener("click", () => setDirection("DOWN"));
document.getElementById("leftBtn").addEventListener("click", () => setDirection("LEFT"));
document.getElementById("rightBtn").addEventListener("click", () => setDirection("RIGHT"));
