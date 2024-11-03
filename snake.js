const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box, color: "green" }];
let direction;
let isPaused = false;

let food = createFood();
let foodColor = food.color;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gamesPlayed = localStorage.getItem("gamesPlayed") || 0;

// Function to set the head color
function setHeadColor(color) {
    snake[0].color = color;
}

// Create food with random color and position
function createFood() {
    const colors = ["red", "blue", "yellow", "purple", "orange"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box,
        color: color,
    };
}

// Handle Joystick Movement
const joystickInner = document.getElementById("joystickInner");
let joystickPosX = 0;
let joystickPosY = 0;

joystickInner.addEventListener("touchstart", startDrag);
joystickInner.addEventListener("touchmove", drag);
joystickInner.addEventListener("touchend", endDrag);

function startDrag(e) {
    e.preventDefault();
    joystickPosX = e.touches[0].clientX;
    joystickPosY = e.touches[0].clientY;
}

function drag(e) {
    e.preventDefault();
    const xDiff = e.touches[0].clientX - joystickPosX;
    const yDiff = e.touches[0].clientY - joystickPosY;
    
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0 && direction !== "LEFT") direction = "RIGHT";
        if (xDiff < 0 && direction !== "RIGHT") direction = "LEFT";
    } else {
        if (yDiff > 0 && direction !== "UP") direction = "DOWN";
        if (yDiff < 0 && direction !== "DOWN") direction = "UP";
    }
}

function endDrag(e) {
    joystickPosX = 0;
    joystickPosY = 0;
}

// Update Display
function updateScoreDisplay() {
    document.getElementById("score").innerText = `Current Score: ${score}`;
    document.getElementById("highScore").innerText = `All Time High Score: ${highScore}`;
    document.getElementById("gamesPlayed").innerText = `Games Played: ${gamesPlayed}`;
}

// Game Logic
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Snake Head as Triangle
    ctx.fillStyle = snake[0].color;
    ctx.beginPath();
    ctx.moveTo(snake[0].x + box / 2, snake[0].y + box / 2);
    ctx.lineTo(snake[0].x, snake[0].y + box);
    ctx.lineTo(snake[0].x + box, snake[0].y + box);
    ctx.fill();

    // Draw Snake Body
    for (let i = 1; i < snake.length; i++) {
        ctx.fillStyle = snake[i].color;
        ctx.beginPath();
        ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Draw Food
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, box, box);

    // Move Snake
    let newX = snake[0].x;
    let newY = snake[0].y;
    if (direction === "UP") newY -= box;
    if (direction === "DOWN") newY += box;
    if (direction === "LEFT") newX -= box;
    if (direction === "RIGHT") newX += box;

    const newHead = { x: newX, y: newY, color: snake[0].color };
    
    // Check Collisions
    if (checkCollision(newHead, snake)) {
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

    // Check if Snake Eats Food
    if (newX === food.x && newY === food.y) {
        snake.push({ ...food });
        score++;
        food = createFood();
        foodColor = food.color;
    } else {
        snake.pop();
        snake.unshift(newHead);
    }
    updateScoreDisplay();
}

// Game Loop
function gameLoop() {
    if (!isPaused) draw();
}
setInterval(gameLoop, 100);
