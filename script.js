// Simple platformer with left/right movement, gravity, and basic enemies
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
  vy: 0,
  canJump: true
};

// Ground definition
const ground = {y: 560, height: 40, color: 'green'};

// Simple enemy definition (moves back and forth)
const enemies = [
  {x: 300, y: 0, width: 40, height: 60, color: 'purple', speed: 2, dir: 1},
  {x: 600, y: 0, width: 40, height: 60, color: 'orange', speed: 1.5, dir: -1}
];

// Input handling
const keys = {};
window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup', e => { keys[e.key] = false; });

function applyGravity() {
  player.vy += 0.5;
  player.y += player.vy;
  if (player.y + player.height > ground.y) {
    player.y = ground.y - player.height;
    player.vy = 0;
    player.canJump = true;
  }
  if (player.y < 0) { player.y = 0; player.vy = 0; }
}

function updatePlayer() {
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;
  if (keys['ArrowUp'] && player.canJump) { player.vy = -10; player.canJump = false; }
  applyGravity();
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function updateEnemies() {
  enemies.forEach(e => {
    e.x += e.speed * e.dir;
    // Reverse direction on canvas edges
    if (e.x < 0 || e.x + e.width > canvas.width) e.dir *= -1;
    // Simple ground collision for enemies
    if (e.y + e.height > ground.y) {
      e.y = ground.y - e.height;
    } else {
      // apply gravity to enemies as well
      e.y += 0.5;
    }
  });
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Ground
  ctx.fillStyle = ground.color;
  ctx.fillRect(0, ground.y, canvas.width, ground.height);
  // Player
  updatePlayer();
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  // Enemies
  updateEnemies();
  enemies.forEach(e => {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.width, e.height);
  });
}

function loop(){draw();requestAnimationFrame(loop);} loop();
