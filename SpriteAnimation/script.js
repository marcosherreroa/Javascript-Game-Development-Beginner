const dropdown = document.getElementById('animations');
let playerState = dropdown.value;
dropdown.addEventListener('change', (e) => {
  playerState = e.target.value;
})

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const animationStates = {
  "idle" : {
    index: 0,
    frames: 7
  },
  "jump" : {
    index: 1,
    frames: 7,
  },
  "fall" : {
    index: 2,
    frames: 7,
  },
  "run" : {
    index: 3,
    frames: 9,
  },
  "dizzy" : {
    index: 4,
    frames: 11,
  },
  "sit" : {
    index: 5,
    frames: 5,
  },
  "roll" : {
    index: 6,
    frames: 7,
  },
  "bite" : {
    index: 7,
    frames: 7,
  },
  "ko" : {
    index: 8,
    frames: 12,
  },
  "getHit" : {
    index: 9,
    frames: 4,
  },
};

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'shadow_dog.png';
const spriteWidth = 575;
const spriteHeight = 523;
const staggerFrames = 5;


let frameX = 0;
let frameY = 0;
let gameFrame = 0;

function animate(){
  ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
  //To draw a rectangle -> ctx.fillRect(100,50,100,100);

  let sourceX = (Math.floor(gameFrame/staggerFrames) % animationStates[playerState].frames) * spriteWidth;
  let sourceY = animationStates[playerState].index * spriteHeight;

  //Doc : ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh)
  ctx.drawImage(playerImage,sourceX, sourceY,spriteWidth,spriteHeight,0,0, spriteWidth, spriteHeight);
  
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();

/*
  Another way to cycle through frames
  if (gameFrame % staggerFrames == 0){
    if (frameX < 6) frameX++;
    else frameX = 0;
  }
  */