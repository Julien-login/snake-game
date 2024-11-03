const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box, color: "green" }];
let food = createFood();
let direction = "RIGHT"; // Initial direction
let isPaused = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gamesPlayed = localStorage.getItem("gamesPlayed") || 0;
let joystickStartX, joystickStartY;

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

// Function to set direction
function setDirection(newDirection) {
    if (newDirection === "UP" && direction !== "DOWN") direction = "UP";
    else if (newDirection === "DOWN" && direction !== "UP") direction = "DOWN";
    else if (newDirection === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    else if (newDirection === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

// Keyboard controls
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") setDirection("UP");
    else if (event.key === "ArrowDown") setDirection("DOWN");
    else if (event.key === "ArrowLeft") setDirection("LEFT");
    else if (event.key === "ArrowRight") setDirection("RIGHT");
    else if (event.code === "Space") isPaused = !isPaused;
});

// Joystick controls
const joystickInner = document.getElementById("joystickInner");
const joystick = document.getElementById("joystick");

joystickInner.addEventListener("touchstart", (e) => {
    e.preventDefault();
    joystickStartX = e.touches[0].clientX;
    joystickStartY = e.touches[0].clientY;
});

joystickInner.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const diffX = e.touches[0].clientX - joystickStartX;
    const diffY = e.touches[0].clientY - joystickStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) setDirection("RIGHT");
        else setDirection("LEFT");
    } else {
        if (diffY > 0) setDirection("DOWN");
        else setDirection("UP");
    }
});

joystickInner.addEventListener("touchend", () => {
    joystickStartX = 0;
    joystickStartY = 0;
});

// Game logic and drawing
function draw() {
    if (isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;
    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;

    // Wrap around the canvas edges
    if (snakeX < 0) snakeX = canvas.width - box;
    else if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    else if (snakeY >= canvas.height) snakeY = 0;

    // Add new head position
    const newHead = { x: snakeX, y: snakeY, color: snake[0].color };
    snake.unshift(newHead);

    // Check if snake eats food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = createFood();
    } else {
        snake.pop();
    }

    // Draw food
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, box, box);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? snake[0].color : segment.color;
        ctx.fillRect(segment.x, segment.y, box, box);
    });

    updateScoreDisplay();
}

// Set the game loop
setInterval(draw, 100);
