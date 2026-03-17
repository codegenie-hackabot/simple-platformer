// Very basic platformer skeleton
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Player object (does not respond to input)
const player = { x: 100, y: 500, width: 40, height: 60, color: 'red' };

// Simple ground dimensions
const ground = { y: 560, height: 40, color: 'green' };

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw ground as a green rectangle
  ctx.fillStyle = ground.color;
  ctx.fillRect(0, ground.y, canvas.width, ground.height);
  // Draw player (static)
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Game loop (no physics or controls)
function loop() {
  draw();
  requestAnimationFrame(loop);
}
loop();