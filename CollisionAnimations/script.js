/** @type{HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 375;
canvas.height= 525;
const explosions = [];
let canvasPosition = canvas.getBoundingClientRect();

class Explosion {

  constructor(x,y){
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = 0.7 * this.spriteWidth;
    this.height = 0.7 * this.spriteHeight;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "boom.png";
    this.frame = 0;
    this.timer = 0;
    this.rotationAngle = 2 * Math.PI * Math.random()
    this.sound = new Audio();
    this.sound.src = "boom.wav";
  }

  update(){
    ++this.timer;
    if(this.timer % 10 == 0){
      ++this.frame;
    }
  }

  draw(){
    if (this.frame == 0) this.sound.play();

    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(this.rotationAngle);
    ctx.drawImage(this.image,this.frame*this.spriteWidth,0, 
      this.spriteWidth,this.spriteHeight,-0.5 * this.width, -0.5 * this.width,this.width,this.height);

    ctx.restore();
  }
}

window.addEventListener("click", e => {
  createAnimation(e);
});

/*window.addEventListener("mousemove", e => {
  createAnimation(e);
});*/

function createAnimation(e){
  let positionX = e.x - canvasPosition.x;
  let positionY = e.y - canvasPosition.y;
  explosions.push(new Explosion(positionX,positionY));
}

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i = 0; i < explosions.length; ++i){
    explosions[i].draw();
    explosions[i].update();
    if (explosions[i].frame == 5){
      explosions.splice(i,1);
      --i;
    }
  }
  
  requestAnimationFrame(animate);
}
animate();