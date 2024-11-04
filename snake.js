const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box, color: "green" }];
let direction = "RIGHT";
let food = createFood();
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gamesPlayed = localStorage.getItem("gamesPlayed") || 0;
let isPaused = false;
let joystickCenter = { x: 0, y: 0 };
let isDragging = false;

// Function to set the head color
function setHeadColor(color) {
    snake[0].color = color;
}

function startJoystickDrag(event) {
    isDragging = true;
    const rect = document.getElementById("joystick").getBoundingClientRect();
    joystickCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
    moveJoystick(event); // Initialer Aufruf, um die erste Richtung festzulegen
}

function moveJoystick(event) {
    if (!isDragging) return;

    const touch = event.touches ? event.touches[0] : event;
    const xDiff = touch.clientX - joystickCenter.x;
    const yDiff = touch.clientY - joystickCenter.y;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 20 && direction !== "LEFT") setDirection("RIGHT");
        else if (xDiff < -20 && direction !== "RIGHT") setDirection("LEFT");
    } else {
        if (yDiff > 20 && direction !== "UP") setDirection("DOWN");
        else if (yDiff < -20 && direction !== "DOWN") setDirection("UP");
    }

    // Joystick-Inneres visuell bewegen
    const joystickInner = document.getElementById("joystickInner");
    joystickInner.style.transform = `translate(${Math.min(20, Math.max(-20, xDiff))}px, ${Math.min(20, Math.max(-20, yDiff))}px)`;
}

function endJoystickDrag() {
    isDragging = false;
    // Joystick zurücksetzen
    const joystickInner = document.getElementById("joystickInner");
    joystickInner.style.transform = "translate(-50%, -50%)";
}


// Update score display
function updateScoreDisplay() {
    document.getElementById("score").innerText = `Current Score: ${score}`;
    document.getElementById("highScore").innerText = `All Time High Score: ${highScore}`;
    document.getElementById("gamesPlayed").innerText = `Games Played: ${gamesPlayed}`;
}

// Create a new food object at a random position
function createFood() {
    const colors = ["red", "blue", "yellow", "purple", "orange"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box,
        color: color
    };
}

// Event listener for keyboard controls
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
    else if (event.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
    else if (event.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
    else if (event.code === "Space") isPaused = !isPaused;
});

// Event listeners for on-screen buttons
function setDirection(newDirection) {
    if (newDirection === "UP" && direction !== "DOWN") direction = "UP";
    if (newDirection === "DOWN" && direction !== "UP") direction = "DOWN";
    if (newDirection === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (newDirection === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

// Joystick Setup
const joystick = {
    x: 0,
    y: 0,
    isDragging: false,
};

// Bewegung des Joysticks beginnen
function startJoystickDrag(event) {
    event.preventDefault();
    joystick.isDragging = true;
    joystick.x = event.touches ? event.touches[0].clientX : event.clientX;
    joystick.y = event.touches ? event.touches[0].clientY : event.clientY;
}

// Joystick-Bewegung erfassen
function moveJoystick(event) {
    if (!joystick.isDragging) return;
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;
    const xDiff = x - joystick.x;
    const yDiff = y - joystick.y;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 10 && direction !== "LEFT") direction = "RIGHT";
        else if (xDiff < -10 && direction !== "RIGHT") direction = "LEFT";
    } else {
        if (yDiff > 10 && direction !== "UP") direction = "DOWN";
        else if (yDiff < -10 && direction !== "DOWN") direction = "UP";
    }
}

// Joystick loslassen
function endJoystickDrag() {
    joystick.isDragging = false;
}

// Event Listeners für den Joystick
document.getElementById("joystickInner").addEventListener("mousedown", startJoystickDrag);
document.getElementById("joystickInner").addEventListener("mousemove", moveJoystick);
document.getElementById("joystickInner").addEventListener("mouseup", endJoystickDrag);
document.getElementById("joystickInner").addEventListener("mouseleave", endJoystickDrag);

// Main game loop
function gameLoop() {
    if (isPaused) return;

    // Move the snake
    let newHead = { ...snake[0] };
    if (direction === "UP") newHead.y -= box;
    if (direction === "DOWN") newHead.y += box;
    if (direction === "LEFT") newHead.x -= box;
    if (direction === "RIGHT") newHead.x += box;

    // Wrap around edges
    if (newHead.x < 0) newHead.x = canvas.width - box;
    if (newHead.x >= canvas.width) newHead.x = 0;
    if (newHead.y < 0) newHead.y = canvas.height - box;
    if (newHead.y >= canvas.height) newHead.y = 0;

    // Check for self-collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
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
        updateScoreDisplay();
        return;
    }

    // Check if the snake eats the food
    if (newHead.x === food.x && newHead.y === food.y) {
        newHead.color = food.color;
        score++;
        food = createFood();
    } else {
        snake.pop(); // Remove last part of snake if no food eaten
    }

    snake.unshift(newHead); // Add new head to the front of snake array

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach(segment => {
        ctx.fillStyle = segment.color;
        ctx.beginPath();
        ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    });
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, box, box);

    updateScoreDisplay();
}

// Start the game loop
setInterval(gameLoop, 100);
