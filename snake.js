const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const boxSize = 20;
let snake = [{ x: 9 * boxSize, y: 10 * boxSize, color: 'green' }];
let food = createFood();
let direction = 'RIGHT';
let isPaused = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gamesPlayed = localStorage.getItem('gamesPlayed') || 0;

// Joystick variables
const joystick = document.getElementById('joystick');
const joystickInner = document.getElementById('joystickInner');
let joystickStartX, joystickStartY;

// Function to set the head color
function setHeadColor(color) {
  snake[0].color = color;
}

// Update the score display
function updateScoreDisplay() {
  document.getElementById('score').innerText = `Current Score: ${score}`;
  document.getElementById('highScore').innerText = `All Time High Score: ${highScore}`;
  document.getElementById('gamesPlayed').innerText = `Games Played: ${gamesPlayed}`;
}

// Create food at random position
function createFood() {
  const colors = ['red', 'blue', 'yellow', 'purple', 'orange'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return {
    x: Math.floor(Math.random() * 19) * boxSize,
    y: Math.floor(Math.random() * 19) * boxSize,
    color: color
  };
}

// Set the direction based on input
function setDirection(newDirection) {
  if (newDirection === 'UP' && direction !== 'DOWN') direction = 'UP';
  else if (newDirection === 'DOWN' && direction !== 'UP') direction = 'DOWN';
  else if (newDirection === 'LEFT' && direction !== 'RIGHT') direction = 'LEFT';
  else if (newDirection === 'RIGHT' && direction !== 'LEFT') direction = 'RIGHT';
}

// Keyboard controls
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') setDirection('UP');
  else if (event.key === 'ArrowDown') setDirection('DOWN');
  else if (event.key === 'ArrowLeft') setDirection('LEFT');
  else if (event.key === 'ArrowRight') setDirection('RIGHT');
  else if (event.code === 'Space') isPaused = !isPaused;
});

// Joystick controls
joystickInner.addEventListener('touchstart', (e) => {
  e.preventDefault();
  joystickStartX = e.touches[0].clientX - joystick.offsetLeft;
  joystickStartY = e.touches[0].clientY - joystick.offsetTop;
});

joystickInner.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const diffX = e.touches[0].clientX - joystickStartX;
  const diffY = e.touches[0].clientY - joystickStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) setDirection('RIGHT');
    else setDirection('LEFT');
  } else {
    if (diffY > 0) setDirection('DOWN');
    else setDirection('UP');
  }
});

joystickInner.addEventListener('touchend', () => {
  joystickStartX = 0;
  joystickStartY = 0;
});

// Game loop
function draw() {
  if (isPaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move the snake
  let newX = snake[0].x;
  let newY = snake[0].y;

  if (direction === 'UP') newY -= boxSize;
  if (direction === 'DOWN') newY += boxSize;
  if (direction === 'LEFT') newX -= boxSize;
  if (direction === 'RIGHT') newX += boxSize;

  // Wrap the snake around the edges
  if (newX < 0) newX = canvas.width - boxSize;
  else if (newX >= canvas.width) newX = 0;
  if (newY < 0) newY = canvas.height - boxSize;
  else if (newY >= canvas.height) newY = 0;

  const newHead = { x: newX, y: newY, color: snake[0].color };
  snake.unshift(newHead);

  // Check for collisions
  if (checkCollision(newHead, snake)) {
    // Game over logic
  }

  // Eat food
  if (newX === food.x && newY === food.y) {
    score++;
    food = createFood();
  } else {
    snake.pop();
  }

  // Draw food and snake
  ctx.fillStyle = food.color;
  ctx.fillRect(food.x, food.y, boxSize, boxSize);

  snake.forEach((segment) => {
    ctx.fillStyle = segment.color;
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
  });

  updateScoreDisplay();
}

setInterval(draw, 100);
