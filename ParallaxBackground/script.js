const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = canvas.width = canvas.clientWidth;
const CANVAS_HEIGHT = canvas.height = canvas.clientHeight;
const DEST_IMAGE_WIDTH = Math.floor(2400*CANVAS_HEIGHT/720);
/*const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;*/

const showGameSpeed = document.getElementById("showGameSpeed");
const slider = document.getElementById("slider");
let gameSpeed = slider.value;
showGameSpeed.innerHTML = gameSpeed;
slider.addEventListener("change", event => {
  gameSpeed = event.target.value;
  showGameSpeed.innerHTML = gameSpeed;
})

const backgroundLayer1 = new Image();
backgroundLayer1.src = "layer-1.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "layer-2.png";
const backgroundLayer3 = new Image();
backgroundLayer3.src = "layer-3.png";
const backgroundLayer4 = new Image();
backgroundLayer4.src = "layer-4.png";
const backgroundLayer5 = new Image();
backgroundLayer5.src = "layer-5.png";

window.addEventListener('load', e => {
  class Layer {
    constructor(image, speedModifier){
      this.x = 0;
      this.x2 = 2400;
      this.image = image;
      this.speedModifier = speedModifier;
      this.speed = speedModifier * gameSpeed;
    }
  
    update(){
      this.speed = this.speedModifier * gameSpeed;
      this.x -= this.speed;
  
      if(this.x <= -DEST_IMAGE_WIDTH) this.x += DEST_IMAGE_WIDTH;
    }
  
    draw(){
      ctx.drawImage(this.image,this.x,0,DEST_IMAGE_WIDTH,CANVAS_HEIGHT);
      ctx.drawImage(this.image,this.x + DEST_IMAGE_WIDTH,0,DEST_IMAGE_WIDTH,CANVAS_HEIGHT);
    }
  }
  
  let layers = [];
  layers.push(new Layer(backgroundLayer1,0.2));
  layers.push(new Layer(backgroundLayer2,0.4));
  layers.push(new Layer(backgroundLayer3,0.6));
  layers.push(new Layer(backgroundLayer4,0.8));
  layers.push(new Layer(backgroundLayer5,1));
  
  function animate(){
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
  
    layers.forEach(lay => {
      lay.draw(); lay.update();
    });
    
    requestAnimationFrame(animate);
  };
  
  animate();
})



