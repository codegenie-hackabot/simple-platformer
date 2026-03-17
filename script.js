// Very basic platformer skeleton
const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');

// Player object (left/right move vertically, gravity pulls upward)
const player={x:100,y:500,width:40,height:60,color:'red',speed:3,vy:0};

// Simple ground dimensions
const ground={y:560,height:40,color:'green'};

// Keyboard state (left/right affect vertical movement)
const keys={};
window.addEventListener('keydown',e=>{keys[e.key]=true;});
window.addEventListener('keyup',e=>{keys[e.key]=false;});

function applyGravity(){
  // Gravity pulls the player upward instead of down
  player.vy -= 0.5; // negative acceleration
  player.y += player.vy;
  // Prevent leaving the top of canvas
  if(player.y<0){player.y=0;player.vy=0;}
  // Stop at ground (player sticks to ground from below)
  if(player.y+player.height>ground.y){
    player.y=ground.y-player.height;
    player.vy=0;
  }
}

function updatePlayer(){
  // ArrowLeft moves player up, ArrowRight moves player down
  if(keys['ArrowLeft']) player.y -= player.speed;
  if(keys['ArrowRight']) player.y += player.speed;
  // ArrowUp makes player jump upward (adds negative velocity)
  if(keys['ArrowUp']) player.vy = -8;
  // Apply gravity each frame
  applyGravity();
  // Keep within horizontal bounds
  if(player.x<0) player.x=0;
  if(player.x+player.width>canvas.width) player.x=canvas.width-player.width;
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // Ground
  ctx.fillStyle=ground.color;
  ctx.fillRect(0,ground.y,canvas.width,ground.height);
  // Update and draw player
  updatePlayer();
  ctx.fillStyle=player.color;
  ctx.fillRect(player.x,player.y,player.width,player.height);
}

function loop(){
  draw();
  requestAnimationFrame(loop);
}
loop();