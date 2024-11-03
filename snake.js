const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [];
let headColor = "green"; // Initial head color
snake[0] = { x: 9 * box, y: 10 * box, color: headColor }; // Initial head

let food = createFood();
let foodColor = food.color;
let specialMode = false;
let specialModeTimeout;
let direction;
let isPaused = false;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gamesPlayed = localStorage.getItem("gamesPlayed") || 0;

// Function to set the head color
function setHeadColor(color) {
    headColor = color;
    snake[0].color = headColor; // Update the color of the head
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

// Handle input
function setDirection(dir) {
    if (dir === "UP" && direction !== "DOWN") direction = "UP";
    else if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
    else if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    else if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.code === "Space") isPaused = !isPaused;
});

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

    // Draw the snake's head as a triangle
    drawHead(snake[0]);

    // Draw the snake's body segments
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

    const newHead = { x: snakeX, y: snakeY, color: headColor }; // Maintain head color

    // Check for self-collision
    if (checkCollision(newHead, snake)) {
        alert("Game Over! The snake collided with itself.");
        // Reset game state here if needed
        return;
    }

    // Eat food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        // Add a new segment with the color of the food
        snake.push({ ...newHead, color: foodColor });
        food = createFood();
        foodColor = food.color;
    } else {
        snake.pop();
        snake.unshift(newHead);
    }

    updateScoreDisplay();
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

// Update food position every 5 seconds
setInterval(() => {
    if (!isPaused) {
        food = createFood();
        foodColor = food.color;
    }
}, 5000);

function gameLoop() {
    if (!isPaused) {
        draw();
    }
}

setInterval(gameLoop, 100);
setInterval(updateScoreDisplay, 1000);
