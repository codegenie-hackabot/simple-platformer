// Very basic platformer skeleton
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Player object (moves with keyboard, but controls are inverted)
const player = { x: 100, y: 500, width: 40, height: 60, color: 'red', speed: 3 };

// Simple ground dimensions
const ground = { y: 560, height: 40, color: 'green' };

// Keyboard state (inverted controls)
const keys = {};
window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup', e => { keys[e.key] = false; });

function updatePlayer() {
  // Arrow keys move opposite direction
  if (keys['ArrowLeft']) player.x += player.speed; // left arrow moves right
  if (keys['ArrowRight']) player.x -= player.speed; // right arrow moves left
  if (keys['ArrowUp']) player.y += player.speed; // up arrow moves down
  if (keys['ArrowDown']) player.y -= player.speed; // down arrow moves up
  // Keep within canvas bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > ground.y) player.y = ground.y - player.height;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw ground as a green rectangle
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