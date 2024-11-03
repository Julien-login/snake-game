const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box, color: "green" }];
let food = createFood();
let direction;
let isPaused = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gamesPlayed = localStorage.getItem("gamesPlayed") || 0;

// Setzt die Kopf-Farbe dauerhaft
function setHeadColor(color) {
    snake[0].color = color;
}

// Aktualisiert das Score-Display
function updateScoreDisplay() {
    document.getElementById("score").innerText = `Aktuelles Ergebnis: ${score}`;
    document.getElementById("highScore").innerText = `Allzeit-Highscore: ${highScore}`;
    document.getElementById("gamesPlayed").innerText = `Gespielte Spiele: ${gamesPlayed}`;
}

// Erstellt einen neuen Snack mit zufälliger Farbe und Position
function createFood() {
    const colors = ["red", "blue", "yellow", "purple", "orange"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    document.getElementById("poweredBy").style.color = color; // Setzt die Farbe des Textes
    return {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box,
        color: color
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

// Kollisionserkennung
function checkCollision(head, array) {
    for (let i = 1; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Zeichnet den Kopf der Schlange als Dreieck
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

// Hauptspiel-Zeichnen
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Kopf zeichnen
    drawHead(snake[0]);

    // Segmente zeichnen
    for (let i = 1; i < snake.length; i++) {
        ctx.fillStyle = snake[i].color;
        ctx.beginPath();
        ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    }

    // Snack anzeigen
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, box, box);

    // Bewegung
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;
    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;

    // Randkollision
    if (snakeX < 0) snakeX = canvas.width - box;
    else if (snakeX >= canvas.width) snakeX = 0;
    if (snakeY < 0) snakeY = canvas.height - box;
    else if (snakeY >= canvas.height) snakeY = 0;

    const newHead = { x: snakeX, y: snakeY, color: snake[0].color }; // Kopffarbe bleibt konstant

    // Kollisionserkennung
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
        updateScoreDisplay();
        return;
    }

    // Snack aufnehmen
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        newHead.color = snake[0].color; // Kopffarbe wird übernommen
        snake.push({ ...newHead, color: food.color }); // Neues Segment bekommt Snackfarbe
        food = createFood();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    updateScoreDisplay();
}

// Snack-Positionierung
setInterval(() => {
    if (!isPaused) {
        food = createFood();
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
