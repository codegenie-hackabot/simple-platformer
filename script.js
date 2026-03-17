// Simple side-scrolling platformer with Mario rectangle, platforms, enemies, and a Play Again button
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// ----- Game constants -----
const WORLD_WIDTH = 2000; // total level width
const VIEWPORT_MARGIN = 200; // when player reaches this distance from edge, camera moves

// ----- Game state -----
function initGame(){
  // Player (world coordinates)
  player.x = 100;
  player.y = 0;
  player.vy = 0;
  player.canJump = false;
  player.health = 3;
  player.invulnerable = false;
  player.invulnTimer = 0;
  player.alive = true;
  // Enemies (reset positions)
  enemies = [
    {x: 300, y: ground.y - 60, width: 40, height: 60, color: 'purple', speed: 2, dir: 1},
    {x: 600, y: ground.y - 60, width: 40, height: 60, color: 'orange', speed: 1.5, dir: -1},
    {x: 1200, y: ground.y - 60, width: 40, height: 60, color: 'blue', speed: 2.5, dir: -1}
  ];
  cameraX = 0;
}

// Player object (world coordinates)
const player = {
  x: 100,
  y: 0,
  width: 40,
  height: 60,
  speed: 3,
  vy: 0,
  canJump: false,
  health: 3,
  invulnerable: false,
  invulnTimer: 0,
  alive: true
};

// Ground (world coordinates)
const ground = {y: 560, height: 40, color: 'green'};

// Platforms – positioned throughout the world for side scrolling
const platforms = [
  {x: 120, y: 500, width: 120, height: 15, color: '#8B4513'},
  {x: 260, y: 420, width: 120, height: 15, color: '#8B4513'},
  {x: 400, y: 340, width: 120, height: 15, color: '#8B4513'},
  {x: 540, y: 260, width: 120, height: 15, color: '#8B4513'},
  {x: 720, y: 200, width: 150, height: 15, color: '#8B4513'},
  {x: 940, y: 320, width: 180, height: 15, color: '#8B4513'},
  {x: 1180, y: 380, width: 200, height: 15, color: '#8B4513'},
  {x: 1450, y: 300, width: 150, height: 15, color: '#8B4513'},
  {x: 1700, y: 420, width: 180, height: 15, color: '#8B4513'}
];

let enemies = [];
initGame();

// Input handling
const keys = {};
window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup', e => { keys[e.key] = false; });

let cameraX = 0; // horizontal offset of the viewport

function applyGravity(){
  player.vy += 0.5;
  player.y += player.vy;
  // Ground collision
  if (player.y + player.height > ground.y){
    player.y = ground.y - player.height;
    player.vy = 0;
    player.canJump = true;
  }
  // Platform collision (from above only)
  platforms.forEach(p => {
    const onTop = player.y + player.height > p.y &&
                  player.y + player.height - player.vy <= p.y &&
                  player.x + player.width > p.x &&
                  player.x < p.x + p.width;
    if (onTop){
      player.y = p.y - player.height;
      player.vy = 0;
      player.canJump = true;
    }
  });
  // Ceiling
  if (player.y < 0){ player.y = 0; player.vy = 0; }
}

function updatePlayer(){
  if (!player.alive) return;
  if (keys['ArrowLeft']) player.x -= player.speed;
  if (keys['ArrowRight']) player.x += player.speed;
  if (keys['ArrowUp'] && player.canJump){ player.vy = -10; player.canJump = false; }
  applyGravity();
  // Keep player within world bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > WORLD_WIDTH) player.x = WORLD_WIDTH - player.width;
  // Camera follows player
  if (player.x - cameraX > canvas.width - VIEWPORT_MARGIN){
    cameraX = player.x - (canvas.width - VIEWPORT_MARGIN);
  } else if (player.x - cameraX < VIEWPORT_MARGIN){
    cameraX = player.x - VIEWPORT_MARGIN;
  }
  // Clamp camera to world
  if (cameraX < 0) cameraX = 0;
  if (cameraX > WORLD_WIDTH - canvas.width) cameraX = WORLD_WIDTH - canvas.width;
  // Invulnerability timer
  if (player.invulnerable){
    player.invulnTimer--;
    if (player.invulnTimer <= 0) player.invulnerable = false;
  }
}

function updateEnemies(){
  enemies.forEach(e=>{
    e.x += e.speed * e.dir;
    if (e.x < 0 || e.x + e.width > WORLD_WIDTH) e.dir *= -1;
    e.y = ground.y - e.height; // stay on ground
  });
}

function checkCollisions(){
  if (!player.alive) return;
  enemies = enemies.filter(e=>{
    const colliding = player.x < e.x+e.width && player.x+player.width > e.x &&
                     player.y < e.y+e.height && player.y+player.height > e.y;
    if (!colliding) return true;
    const landing = player.vy > 0 && (player.y + player.height - player.vy) <= e.y;
    if (landing){
      return false; // kill enemy
    } else {
      if (!player.invulnerable){
        player.health--;
        const dx = player.x + player.width/2 - (e.x + e.width/2);
        const dir = dx >= 0 ? 1 : -1;
        player.x += dir * 30;
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > WORLD_WIDTH) player.x = WORLD_WIDTH - player.width;
        player.invulnerable = true;
        player.invulnTimer = 30;
        if (player.health <= 0) player.alive = false;
      }
      return true;
    }
  });
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Helper to draw with camera offset
  const drawRect = (obj, color)=>{
    ctx.fillStyle = color;
    ctx.fillRect(obj.x - cameraX, obj.y, obj.width, obj.height);
  };

  // Ground (spans world width)
  drawRect({x:0, y:ground.y, width:WORLD_WIDTH, height:ground.height}, ground.color);

  // Platforms
  platforms.forEach(p=>drawRect(p, p.color));

  // Player
  updatePlayer();
  drawRect({x:player.x, y:player.y, width:player.width, height:player.height}, player.alive ? 'red' : 'gray');
  ctx.fillStyle = 'white';
  ctx.font = '12px sans-serif';
  ctx.fillText('Mario', player.x - cameraX + 4, player.y + player.height/2 + 4);

  // Enemies
  updateEnemies();
  enemies.forEach(e=>drawRect(e, e.color));

  // Collisions
  checkCollisions();

  // HUD (fixed on screen)
  ctx.fillStyle = 'black';
  ctx.font = '20px sans-serif';
  ctx.fillText('Health: '+player.health,10,30);

  // Win / Game Over messages + Play Again button
  if (!player.alive){
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '40px sans-serif';
    ctx.fillText('Game Over', canvas.width/2-100, canvas.height/2-30);
    showPlayAgainButton();
  } else if (enemies.length===0){
    ctx.fillStyle = 'rgba(0,255,0,0.5)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '40px sans-serif';
    ctx.fillText('You Win!', canvas.width/2-100, canvas.height/2-30);
    showPlayAgainButton();
  }
}

function loop(){
  draw();
  requestAnimationFrame(loop);
}
loop();

// ----- Play Again button -----
function showPlayAgainButton(){
  if (document.getElementById('playAgainBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'playAgainBtn';
  btn.textContent = 'Play Again';
  btn.style.position = 'absolute';
  btn.style.left = (canvas.offsetLeft + canvas.width/2 - 60) + 'px';
  btn.style.top = (canvas.offsetTop + canvas.height/2 + 20) + 'px';
  btn.style.padding = '10px 20px';
  btn.style.fontSize = '16px';
  btn.onclick = () => {
    initGame();
    btn.remove();
  };
  document.body.appendChild(btn);
}
