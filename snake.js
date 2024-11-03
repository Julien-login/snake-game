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

// Funktion zum Setzen der Kopf-Farbe
function setHeadColor(color) {
    snake[0].color = color;
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
        isSpecial: Math.random() < 0.15 // 15% Wahrscheinlichkeit für einen Stern-Snack
    };
}

// Spezialmodus aktivieren
function activateSpecialMode() {
    specialMode = true;
    clearTimeout(specialModeTimeout);
    specialModeTimeout = setTimeout(() => {
        specialMode = false;
    }, 20000); // 20 Sekunden Immunität
}

// Steuerungseingaben per Tasten und Buttons
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

// Hauptspiel-Rendering
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Farbe der Schlange zeichnen
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = snake[i].color;
        ctx.beginPath();
        ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    // Snack anzeigen
    ctx.fillStyle = foodColor;
    if (food.isSpecial) {
        ctx.beginPath();
        ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, 2 * Math.PI);
        ctx.fill();
    } else {
        ctx.fillRect(food.x, food.y, box, box);
    }

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

    const newHead = { x: snakeX, y: snakeY, color: foodColor };

    // Kollision mit sich selbst
    if (checkCollision(newHead, snake)) {
        alert("Game Over! Die Schlange hat sich selbst getroffen.");
        gamesPlayed++;
        localStorage.setItem("gamesPlayed", gamesPlayed);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        score = 0;
        snake = [{ x: 9 * box, y: 10 * box, color: "green" }];
        direction = undefined;
        food = createFood();
        foodColor = food.color;
        updateScoreDisplay();
        return;
    }

    // Snack aufnehmen
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        if (food.isSpecial) activateSpecialMode();
        // Die Farbe des Snacks als Farbe des neuen Segmentes verwenden
        newHead.color = food.color;
        food = createFood();
        foodColor = food.color;
        document.getElementById("poweredBy").style.color = foodColor;
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    updateScoreDisplay();
}

// Snack-Position alle 5 Sekunden neu generieren
setInterval(() => {
    if (!isPaused) {
        food = createFood();
        foodColor = food.color;
        document.getElementById("poweredBy").style.color = foodColor;
    }
}, 5000);

function gameLoop() {
    if (!isPaused) {
        draw();
    }
}

// Spiel starten
setInterval(gameLoop, 100);
setInterval(updateScoreDisplay, 1000);
