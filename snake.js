const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box, color: "green" }];
let direction = "RIGHT";
let isPaused = false;

let food = createFood();
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gamesPlayed = localStorage.getItem("gamesPlayed") || 0;

// Function to set head color
function setHeadColor(color) {
    snake[0].color = color;
}

// Display the score and stats
function updateScoreDisplay() {
    document.getElementById("score").innerText = `Current Score: ${score}`;
    document.getElementById("highScore").innerText = `All Time High Score: ${highScore}`;
    document.getElementById("gamesPlayed").innerText = `Games Played: ${gamesPlayed}`;
}

// Create food at random position with random color
function createFood() {
    const colors = ["red", "blue", "yellow", "purple", "orange"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box,
        color: color
    };
}

// Handle keyboard input for direction
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.code === "Space") isPaused = !isPaused;
});

// Draw joystick for touch devices
function setupJoystick() {
    const joystick = document.getElementById("joystick");
    const joystickInner = document.getElementById("joystickInner");
    let startX, startY;

    joystickInner.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    joystickInner.addEventListener("touchmove", (e) => {
        const xDiff = e.touches[0].clientX - startX;
        const yDiff = e.touches[0].clientY - startY;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0 && direction !== "LEFT") direction = "RIGHT";
            if (xDiff < 0 && direction !== "RIGHT") direction = "LEFT";
        } else {
            if (yDiff > 0 && direction !== "UP") direction = "DOWN";
            if (yDiff < 0 && direction !== "DOWN") direction = "UP";
        }
    });
}

setupJoystick();

// Collision check for self-collision
function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

// Draw the snake and food
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake head
    ctx.fillStyle = snake[0].color;
    ctx.beginPath();
    ctx.moveTo(snake[0].x + box / 2, snake[0].y);
    ctx.lineTo(snake[0].x, snake[0].y + box);
    ctx.lineTo(snake[0].x + box, snake[0].y + box);
    ctx.closePath();
    ctx.fill();

    // Draw snake body
    for (let i = 1; i < snake.length; i++) {
        ctx.fillStyle = snake[i].color;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, box, box);

    // Snake movement
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;
    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;

    // Boundary handling
    if (snakeX < 0) snakeX = canvas.width - box;
    else if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    else if (snakeY >= canvas.height) snakeY = 0;

    // Create new head and check for collisions
    const newHead = { x: snakeX, y: snakeY, color: snake[0].color };
    if (checkCollision(newHead)) {
        alert("Game Over!");
        gamesPlayed++;
        localStorage.setItem("gamesPlayed", gamesPlayed);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        resetGame();
        return;
    }

    // Check if the snake eats the food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        newHead.color = food.color;
        food = createFood();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    updateScoreDisplay();
}

// Reset game
function resetGame() {
    score = 0;
    direction = "RIGHT";
    snake = [{ x: 9 * box, y: 10 * box, color: snake[0].color }];
    food = createFood();
}

// Start game loop
setInterval(draw, 100);
updateScoreDisplay();
