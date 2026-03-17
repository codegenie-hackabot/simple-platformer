// Simple platformer with left/right movement, gravity, enemies, knock‑back, temporary invulnerability, and player death
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
  canJump: true,
  health: 3,
  invulnerable: false,
  invulnTimer: 0,
  alive: true // new flag
};

// Ground definition
const ground = {y: 560, height: 40, color: 'green'};

// Enemies – stay on ground and move horizontally
const enemies = [
  {x: 300, y: ground.y - 60, width: 40, height: 60, color: 'purple', speed: 2, dir: 1},
  {x: 600, y: ground.y - 60, width: 40, height: 60, color: 'orange', speed: 1.5, dir: -1}
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
  if (!player.alive) return; // stop movement when dead
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;
  if (keys['ArrowUp'] && player.canJump) { player.vy = -10; player.canJump = false; }
  applyGravity();
  // keep within bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  // invulnerability timer
  if (player.invulnerable) {
    player.invulnTimer--;
    if (player.invulnTimer <= 0) {
      player.invulnerable = false;
      player.color = 'red';
    }
  }
}

function updateEnemies() {
  enemies.forEach(e => {
    e.x += e.speed * e.dir;
    if (e.x < 0 || e.x + e.width > canvas.width) e.dir *= -1;
    e.y = ground.y - e.height; // stay on ground
  });
}

function checkCollisions() {
  if (!player.alive || player.invulnerable) return;
  enemies.forEach(e => {
    const colliding =
      player.x < e.x + e.width &&
      player.x + player.width > e.x &&
      player.y < e.y + e.height &&
      player.y + player.height > e.y;
    if (colliding && player.health > 0) {
      // Damage
      player.health--;
      // Knock‑back
      const dx = player.x + player.width/2 - (e.x + e.width/2);
      const direction = dx >= 0 ? 1 : -1;
      player.x += direction * 30;
      // Clamp after knock‑back
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
      // Invulnerability period
      player.invulnerable = true;
      player.invulnTimer = 30;
      player.color = 'black';
      // If health dropped to zero, mark dead
      if (player.health <= 0) {
        player.alive = false;
        player.color = 'gray'; // visual cue for death
      }
    }
  });
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Ground
  ctx.fillStyle = ground.color;
  ctx.fillRect(0, ground.y, canvas.width, ground.height);
  // Player (only drawn if alive or dead state)
  updatePlayer();
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  // Enemies
  updateEnemies();
  enemies.forEach(e => {
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.width, e.height);
  });
  // Collisions
  checkCollisions();
  // Health display
  ctx.fillStyle = 'black';
  ctx.font = '20px sans-serif';
  ctx.fillText('Health: ' + player.health, 10, 30);
  // If dead, show a message
  if (!player.alive) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px sans-serif';
    ctx.fillText('Game Over', canvas.width/2 - 100, canvas.height/2);
  }
}

function loop() {
  draw();
  requestAnimationFrame(loop);
}
loop();
