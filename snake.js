const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
};

let direction;
let isPaused = false;

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.code === "Space") isPaused = !isPaused;
});

function checkCollision(head, array) {
    if (array.length <= 1) return false; // Keine Kollision, wenn die Schlange nur ein Segment hat
    for (let i = 1; i < array.length; i++) { // Beginne ab dem zweiten Segment
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function moveFood() {
    const directions = ["UP", "DOWN", "LEFT", "RIGHT"];
    const direction = directions[Math.floor(Math.random() * directions.length)];

    if (direction === "UP" && food.y > 0) food.y -= box;
    if (direction === "DOWN" && food.y < canvas.height - box) food.y += box;
    if (direction === "LEFT" && food.x > 0) food.x -= box;
    if (direction === "RIGHT" && food.x < canvas.width - box) food.x += box;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.beginPath();
        ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, 2 * Math.PI);
        ctx.fillStyle = i === 0 ? "green" : "lightgreen";
        ctx.fill();
        ctx.strokeStyle = "darkgreen";
        ctx.stroke();
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;
    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;

    if (snakeX < 0) snakeX = canvas.width - box;
    else if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    else if (snakeY >= canvas.height) snakeY = 0;

    const newHead = { x: snakeX, y: snakeY };

    if (checkCollision(newHead, snake)) {
        alert("Game Over! Die Schlange hat sich selbst getroffen.");
        clearInterval(game); // Stoppe das Spiel, statt die Seite neu zu laden
        return;
    }

    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        };
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
}

function gameLoop() {
    if (!isPaused) {
        draw();
        moveFood();
    }
}

const game = setInterval(gameLoop, 100);
