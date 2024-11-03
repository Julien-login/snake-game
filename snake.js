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
// Funktion zum Setzen der Kopf-Farbe
function setHeadColor(color) {
    snake[0].color = color;
}

let gamesPlayed = localStorage.getItem("gamesPlayed") || 0;

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
        isSpecial: Math.random() < 0.01 // 1% Chance, dass ein Stern-Snack erscheint
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

// Steuerungseingaben

// Steuerung per Button
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
    // Canvas leeren
    ctx.clearRect(0, 0, canvas.width, canvas.height);

// Farbe der Schlange

for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = snake[i].color; // Segment behält seine individuelle Farbe
    ctx.beginPath();
    ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, 2 * Math.PI); // Rundes Segment
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
}



    // Essen anzeigen
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
        food = createFood();        foodColor = food.color;
        updateScoreDisplay();
        return;
    }

// Snack-Position alle 5 Sekunden neu generieren

setInterval(() => {
    if (!isPaused) {
        food = createFood();
        foodColor = food.color;
        document.getElementById("poweredBy").style.color = foodColor;
    }
}, 5000);




// Funktion, um das Essen zu erstellen
function createFood() {
    const food = {
        // Beispiel: zufällige Position und Farbe generieren
        x: Math.floor(Math.random() * 20), // Position x
        y: Math.floor(Math.random() * 20), // Position y
        color: '#' + Math.floor(Math.random() * 16777215).toString(16) // Zufällige Farbe
    };
    return food;
}

// Funktion, um zu prüfen, ob das Essen gegessen wurde
function checkIfFoodEaten() {
    // Prüfe, ob die Spielfigur an der Position des Essens ist
    if (player.x === food.x && player.y === food.y) {
        // Essen neu erstellen und Farbe aktualisieren
        food = createFood();
        foodColor = food.color;
        document.getElementById("poweredBy").style.color = foodColor;
    }
}

// Beispiel: wiederholt die Prüfung auf Konsumierung
setInterval(() => {
    if (!isPaused) {
        checkIfFoodEaten();
    }
}, 100); // Intervall für die Prüfung alle 100ms

    // Snack aufnehmen
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        if (food.isSpecial) activateSpecialMode(); // Aktiviert Unsterblichkeit nur bei speziellen Snacks
        food = createFood();
        foodColor = food.color;
        document.getElementById("poweredBy").style.color = foodColor; // Farbe für „Powered by“-Text aktualisieren
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
    updateScoreDisplay();
}

function gameLoop() {
    if (!isPaused) {
        draw();
    }
}

function relocateFood() {
    food = createFood();
    foodColor = food.color;
    document.getElementById("poweredBy").style.color = foodColor; // Farbe des „Powered by“-Textes aktualisieren
}
setInterval(relocateFood, 5000); // Snack alle 5 Sekunden neu platzieren


// Spiel starten und Anzeige regelmäßig aktualisieren
const game = setInterval(gameLoop, 100);
setInterval(updateScoreDisplay, 1000); // Anzeige jede Sekunde aktualisieren
