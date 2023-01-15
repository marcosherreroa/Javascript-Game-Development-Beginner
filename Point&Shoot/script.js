/** @type{HTMLCanvasElement} */
// Voy por el 3:30
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.font = '50px Impact';

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 300;
let lastTime = 0;

let score = 0;
let gameOver = false;

let ravens = [];

class Raven {

  constructor(){
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random()*0.6 + 0.4;
    this.width = this.sizeModifier * this.spriteWidth;
    this.height = this.sizeModifier * this.spriteHeight;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 4 + 2;
    this.directionY = Math.random() * 5 - 2.5;
    this.image = new Image();
    this.image.src = "raven.png";
    this.frame = 0;
    this.maxFrame = 6;
    this.markedForDeletion = false;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColors = [Math.floor(Math.random() *255),
                         Math.floor(Math.random() *255),
                         Math.floor(Math.random() *255)];

    this.color = "rgb("+this.randomColors[0]+","+this.randomColors[1]
      +","+this.randomColors[2]+")";
    
    this.hasTrail = Math.random() > 0.5;
  }

  update(deltatime){
    this.x -= this.directionX;
    this.y += this.directionY;

    if (this.x < - this.width) this.markedForDeletion= true;
    if(this.y < 0 || this.y > canvas.height - this.height){
      this.directionY = -this.directionY;
    }

    this.timeSinceFlap += deltatime;
    if(this.timeSinceFlap > this.flapInterval){
      this.frame = (this.frame + 1)%this.maxFrame;
      this.timeSinceFlap = 0;
      if(this.hasTrail){
        for(let i = 0; i < 5; ++i){
          particles.push(new Particle(this.x,this.y,this.width, this.color))
        }
      }
    }

    if(this.x < - this.width) gameOver = true;

  }
  
  draw(){
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x,this.y,this.width,this.height);
    ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,
      this.spriteHeight,this.x,this.y,this.width,this.height);
  }
}

let explosions = [];

class Explosion {
  constructor(x,y,size){
    this.image = new Image();
    this.image.src = "boom.png";
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.width = size * this.spriteWidth;
    this. height = size* this.spriteHeight;
    this.x = x - 0.5*this.width;
    this.y = y - 0.5*this.height;
    this.frame = 0;
    this.maxFrame = 5;
    this.timeSinceFrame = 0;
    this.frameInterval = 100;
    this.markedForDeletion = false;
    this.sound = new Audio();
    this.sound.src = "boom.wav";
  }

  update(deltatime){
    this.timeSinceFrame += deltatime;

    if (this.timeSinceFrame > this.frameInterval){
      this.timeSinceFrame = 0;
      ++this.frame;
      if(this.frame == this.maxFrame) this.markedForDeletion = true;
    }
  }

  draw(){
    if (this.frame == 0)this.sound.play();
    ctx.drawImage(this.image,this.frame*this.spriteWidth,0,this.spriteWidth,
      this.spriteHeight,this.x,this.y,this.width,this.height);
  }
}

let particles = [];
class Particle {
  constructor(x,y,size,color){
    this.size = size;
    this.x = x + 0.5 * this.size + Math.random() * 50 -25;
    this.y = y + 0.3 * this.size + Math.random() * 50 - 25; 
    this.radius = Math.random() * 0.1 * this.size;
    this.maxRadius = 35 + Math.random()*20;
    this.markedForDeletion = false;
    this.speedX = Math.random() * 1 + 0.5;
    this.color = color;
  }

  update(){
    this.x += this.speedX;
    this.radius += 0.5;
    if(this.radius >= this.maxRadius) this.markedForDeletion = true;
  }

  draw(){
    ctx.save();
    ctx.globalAlpha = Math.max(1 - this.radius/this.maxRadius,0);
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    ctx.fill();
    ctx.restore();
  }
}

function drawScore(){
  ctx.fillStyle = 'black';
  ctx.fillText("Score: "+ score, 50, 75);
  ctx.fillStyle = 'white';
  ctx.fillText("Score: "+ score, 55, 80);
}

function drawGameover(){
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER, your score is "+score,0.5*canvas.width,0.5*canvas.height);
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER, your score is "+score,0.5*canvas.width+5,0.5*canvas.height+5);
}

window.addEventListener('click', e => {
  const detectPixelColor = collisionCtx.getImageData(e.x,e.y,1,1);
  const pc = detectPixelColor.data;
  ravens.forEach(raven => {
    if(raven.randomColors[0] === pc[0] &&
      raven.randomColors[1] === pc[1] &&
      raven.randomColors[2] === pc[2]){
      raven.markedForDeletion = true;
      explosions.push(new Explosion(e.x,e.y,raven.sizeModifier))
      ++score;
    }
  })

  
})


function animate(timestamp){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  collisionCtx.clearRect(0,0,canvas.width,canvas.height);

  let deltatime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltatime;

  if(timeToNextRaven > ravenInterval){
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort(function(a,b){return a.sizeModifier - b.sizeModifier});
  
  }

  drawScore();
  [...particles,...ravens,...explosions].forEach(object => {
    object.draw();
    object.update(deltatime);
  })

  ravens = ravens.filter(e => !e.markedForDeletion);
  explosions = explosions.filter(e => !e.markedForDeletion);
  particles = particles.filter(e => !e.markedForDeletion);

  if(!gameOver) requestAnimationFrame(animate);
  else drawGameover();
}

animate(0);