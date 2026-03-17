// Simple platformer with left/right movement and gravity
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Player object
const player = {
  x: 100,
  y: 0,
  width: 40,
  height: 60,
  color: 'red',
  speed: 3,
  vy: 0 // vertical velocity
};

// Ground definition
const ground = {
  y: 560,
  height: 40,
  color: 'green'
};

// Input handling
const keys = {};
window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup', e => { keys[e.key] = false; });

function applyGravity() {
  // Gravity pulls the player downwards
  player.vy += 0.5; // acceleration due to gravity
  player.y += player.vy;
  // Collision with ground
  if (player.y + player.height > ground.y) {
    player.y = ground.y - player.height;
    player.vy = 0;
  }
  // Prevent leaving the top of the canvas
  if (player.y < 0) {
    player.y = 0;
    player.vy = 0;
  }
}

function updatePlayer() {
  // Horizontal movement with arrow keys
  if (keys['ArrowLeft']) {
    player.x -= player.speed;
  }
  if (keys['ArrowRight']) {
    player.x += player.speed;
  }
  // Jump with ArrowUp
  if (keys['ArrowUp'] && player.vy === 0) {
    player.vy = -10; // give an upward impulse
  }
  // Apply gravity each frame
  applyGravity();
  // Keep player within horizontal bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw ground
  ctx.fillStyle = ground.color;
  ctx.fillRect(0, ground.y, canvas.width, ground.height);
  // Update and draw player
  updatePlayer();
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function loop() {
  draw();
  requestAnimationFrame(loop);
}
loop();
