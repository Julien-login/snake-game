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
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.code === "Space") isPaused = !isPaused;
});

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
        ctx.fillRect(segment.x, segment.y, box, box);
    });
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, box, box);

    updateScoreDisplay();
}

// Start the game loop
setInterval(gameLoop, 100);
