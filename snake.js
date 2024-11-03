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
let headColor = "green"; // Standard-Kopffarbe

// Funktion zum Setzen der Kopf-Farbe
function setHeadColor(color) {
    headColor = color;
    snake[0].color = headColor;
}

// Anzeige aktualisieren
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
        color: color,
        isSpecial: Math.random() < 0.15 // 15% Wahrscheinlichkeit für einen speziellen Snack
    };
}

// Steuerungseingaben
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

// Kollisionsprüfung
function checkCollision(head, array) {
    if (specialMode) return false; // Keine Kollision im Spezialmodus
    for (let i = 1; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Zeichnet den Kopf als Dreieck
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

    // Kopf als Dreieck zeichnen
    drawHead(snake[0]);

    // Körpersegmente als Kreise zeichnen
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

    // Neuer Kopf mit der festgelegten Kopf-Farbe
    const newHead = { x: snakeX, y: snakeY, color: headColor };

    if (checkCollision(newHead, snake)) {
        alert("Game Over! Die Schlange hat sich selbst getroffen.");
        gamesPlayed++;
        localStorage.setItem("gamesPlayed", gamesPlayed);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        score = 0;
        snake = [{ x: 9 * box, y: 10 * box, color: headColor }];
        direction = undefined;
        food = createFood();
        foodColor = food.color;
        updateScoreDisplay();
        return;
    }

    // Snack aufnehmen
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        // Die Farbe des neuen Segments entspricht der Farbe des Snacks
        snake.push({ ...snake[snake.length - 1], color: foodColor });
        food = createFood();
        foodColor = food.color;
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    updateScoreDisplay();
}

// Snack alle 5 Sekunden neu platzieren
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
