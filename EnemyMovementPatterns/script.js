/** @type{HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
CANVAS_WIDTH = canvas.width = canvas.clientWidth;
CANVAS_HEIGHT = canvas.height = canvas.clientHeight;

const numberOfEnemies = 15;

let gameFrame = 0;

class Enemy {
  constructor(spriteWidth,spriteHeight, scaleFactor, imagePath){
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = this.spriteWidth * scaleFactor;
    this.height = this.spriteHeight * scaleFactor;
    this.x = Math.random() * (CANVAS_WIDTH - this.width);
    this.y = Math.random() * (CANVAS_HEIGHT - this.height);
    this.frame = 0;
    this.animationSpeed = Math.random() * 3 + 1;
    this.image = new Image();
    this.image.src = imagePath;
  }
  

  draw(){
    //ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.frame*this.spriteWidth, 0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
  }
}

class Enemy1 extends Enemy {
  constructor(){
    super(293,155,0.4, "enemy1.png"); 
  }

  update(){
    this.x += Math.random() * 5 - 2.5;
    this.y += Math.random() * 5 -2.5;
    this.frame = Math.floor(gameFrame / this.animationSpeed) % 6;
  }
}

class Enemy2 extends Enemy {
  constructor(){
    super(266,188,0.3, "enemy2.png");
    this.speed = Math.random() * 4 + 1;
    this.angle = Math.random() * 2;
    this.angleSpeed = Math.random() * 0.2;
    this.curve = Math.random()*7;
  }

  update(){
    this.x -= this.speed;
    this.y += this.curve * Math.sin(this.angle);
    this.angle += this.angleSpeed;

    if (this.x + this.width < 0 ) this.x = CANVAS_WIDTH;
    
    this.frame = Math.floor(gameFrame / this.animationSpeed) % 6;
  }
}

class Enemy3 extends Enemy {
  constructor(){
    super(218,177,0.3, "enemy3.png");
    this.angle = Math.random() * 2 + 0.5;
    this.angleSpeed = Math.random() * 2 ;
    this.curve = Math.random()*(CANVAS_WIDTH/2 - 50) +50;
  }

  update(){
    this.x = CANVAS_WIDTH/2 * Math.cos(this.angle * Math.PI / 200 ) +  CANVAS_WIDTH/2 - this.width/2;
    this.y = CANVAS_HEIGHT/2 * Math.sin(this.angle * Math.PI / 300 ) + CANVAS_HEIGHT/2 - this.height/2;
    //this.y += this.curve * Math.sin(this.angle);
    this.angle += this.angleSpeed;

    if (this.x + this.width < 0 ) this.x = CANVAS_WIDTH;
    
    this.frame = Math.floor(gameFrame / this.animationSpeed) % 6;
  }
}

class Enemy4 extends Enemy {
  constructor(){
    super(213,212,0.3, "enemy4.png");
    this.speed = Math.random() * 4 + 1;
    this.newx = Math.random() * (CANVAS_WIDTH - this.width);
    this.newy = Math.random() * (CANVAS_HEIGHT - this.height);
    this.interval = Math.floor(Math.random() * 200 + 50);
  }

  update(){

    if (gameFrame % this.interval == 0){
      this.newx = Math.random() * (CANVAS_WIDTH - this.width);
      this.newy = Math.random() * (CANVAS_HEIGHT - this.height);
    }

    let dx = this.newx - this.x;
    let dy = this.newy - this.y;
    
    this.x += dx/20;
    this.y += dy/20;

    if (this.x + this.width < 0 ) this.x = CANVAS_WIDTH;
    
    this.frame = Math.floor(gameFrame / this.animationSpeed) % 6;
  }
}


enemiesArray = [];
for (let i = 0; i < numberOfEnemies; ++i){
  enemiesArray.push(new Enemy4());
}


function animate(){
  ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

  enemiesArray.forEach(enemy => {
    enemy.draw();
    enemy.update();
  })

  ++gameFrame;
  requestAnimationFrame(animate);
}
animate();

/*CHALLENGES FOR THE FUTURE:  make enemies follow the mouse or make them avoid it */