const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box, color: "green" }];
let direction;
let isPaused = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gamesPlayed = localStorage.getItem("gamesPlayed") || 0;

let food = createFood();
let foodColor = food.color;

// Funktion zum Setzen der Kopf-Farbe
function setHeadColor(color) {
    snake[0].color = color;
}

// Update der Score-Anzeige
function updateScoreDisplay() {
    document.getElementById("score").innerText = `Current Score: ${score}`;
    document.getElementById("highScore").innerText = `All Time High Score: ${highScore}`;
    document.getElementById("gamesPlayed").innerText = `Games Played: ${gamesPlayed}`;
}

// Snack erstellen
function createFood() {
    const colors = ["red", "blue", "yellow", "purple", "orange"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box,
        color: color
    };
}

// Kollisionsprüfung
function checkCollision(head, array) {
    for (let i = 1; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

// Zeichnen des Kopfes als Dreieck
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

// Hauptspiel-Rendering
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawHead(snake[0]); // Kopf zeichnen

    for (let i = 1; i < snake.length; i++) {
        ctx.fillStyle = snake[i].color;
        ctx.beginPath();
        ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    // Snack anzeigen
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, box, box);

    // Schlange bewegen
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;
    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;

    // Spielfeldgrenzen
    if (snakeX < 0) snakeX = canvas.width - box;
    else if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    else if (snakeY >= canvas.height) snakeY = 0;

    const newHead = { x: snakeX, y: snakeY, color: snake[0].color };

    if (checkCollision(newHead, snake)) {
        alert("Game Over! Die Schlange hat sich selbst getroffen.");
        gamesPlayed++;
        localStorage.setItem("gamesPlayed", gamesPlayed);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        score = 0;
        snake = [{ x: 9 * box, y: 10 * box, color: snake[0].color }];
        direction = undefined;
        food = createFood();
        foodColor = food.color;
        updateScoreDisplay();
        return;
    }

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        newHead.color = foodColor;
        food = createFood();
        foodColor = food.color;
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    updateScoreDisplay();
}

// Steuerung für Tastatur und Joystick
function setDirection(dir) {
    if (dir === "UP" && direction !== "DOWN") direction = "UP";
    else if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
    else if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    else if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
}

// Game Loop
setInterval(draw, 100);
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") setDirection("UP");
    if (e.key === "ArrowDown") setDirection("DOWN");
    if (e.key === "ArrowLeft") setDirection("LEFT");
    if (e.key === "ArrowRight") setDirection("RIGHT");
});

const joystick = document.getElementById("joystick");
joystick.addEventListener("touchstart", (e) => {
    e.preventDefault();
});
