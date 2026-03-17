// Very basic platformer skeleton
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Player object (automatically moves back and forth)
const player = { x: 100, y: 500, width: 40, height: 60, color: 'red', dx: 2 };

// Simple ground dimensions
const ground = { y: 560, height: 40, color: 'green' };

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw ground as a green rectangle
  ctx.fillStyle = ground.color;
  ctx.fillRect(0, ground.y, canvas.width, ground.height);
  // Update player position (bounce at edges)
  player.x += player.dx;
  if (player.x + player.width > canvas.width || player.x < 0) {
    player.dx = -player.dx;
  }
  // Draw player (static aside from automatic motion)
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Game loop (no user input)
function loop() {
  draw();
  requestAnimationFrame(loop);
}
loop();