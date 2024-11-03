const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box, color: "green" };

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
    snake[0].color = color;
}

// Update the score display
function updateScoreDisplay() {
    document.getElementById("score").innerText = `Current Score: ${score}`;
    document.getElementById("highScore").innerText = `All Time High Score: ${highScore}`;
    document.getElementById("gamesPlayed").innerText = `Games Played: ${gamesPlayed}`;
}

// Function to create food at random positions
function createFood() {
    const colors = ["red", "blue", "yellow", "purple", "orange"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box,
        color: color
    };
}

// Detect joystick movement
const joystickInner = document.getElementById("joystickInner");
let joystickPosX, joystickPosY;

joystickInner.addEventListener("touchstart", (e) => {
    joystickPosX = e.touches[0].clientX;
    joystickPosY = e.touches[0].clientY;
});

joystickInner.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const diffX = e.touches[0].clientX - joystickPosX;
    const diffY = e.touches[0].clientY - joystickPosY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) setDirection("RIGHT");
        else setDirection("LEFT");
    } else {
        if (diffY > 0) setDirection("DOWN");
        else setDirection("UP");
    }
});

joystickInner.addEventListener("touchend", () => {
    joystickPosX = 0;
    joystickPosY = 0;
});

// Set direction based on joystick
function setDirection(dir) {
    if (dir === "UP" && direction !== "DOWN") direction = "UP";
    else if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
    else if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    else if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

// Main game drawing function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the head
    ctx.fillStyle = snake[0].color;
    ctx.beginPath();
    ctx.moveTo(snake[0].x + box / 2, snake[0].y);
    ctx.lineTo(snake[0].x, snake[0].y + box);
    ctx.lineTo(snake[0].x + box, snake[0].y + box);
    ctx.closePath();
    ctx.fill();

    // Draw the rest of the snake
    for (let i = 1; i < snake.length; i++) {
        ctx.fillStyle = snake[i].color;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, box, box);

    // Move the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;
    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;

    // Check for boundary wrap
    if (snakeX < 0) snakeX = canvas.width - box;
    else if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    else if (snakeY >= canvas.height) snakeY = 0;

    // Add new head position to snake
    const newHead = { x: snakeX, y: snakeY, color: snake[0].color };
    snake.unshift(newHead);

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = createFood();
    } else {
        snake.pop();
    }

    updateScoreDisplay();
}

// Set the game loop
setInterval(draw, 100);
