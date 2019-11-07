//game.js - https://aaserver.net/gamejs
var c = new GameCanvas('gc');
c.hideScrollBar();
c.setSize(window.innerWidth, window.innerHeight);

var fss = [];

loop();
function loop() {
  c.updateFPS();
  c.background("darkred");
  
  for (var i = 0; i < fss.length; i++) {
    fss[i].run();
  }
  
  if (c.mouse.click)
    fss.push(new FireSystem(c.mouse.x, c.mouse.y, 25));
  
  requestAnimationFrame(loop);
}

function FireSystem (x, y, size) {
  this.particles = [];
  this.x = x;
  this.y = y;
  this.size = size;
  
  this.run = function() {
    for (var i = this.particles.length-1; i >= 0; i--) {
      var p = this.particles[i];
      p.update();
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        this.particles.push(new Fire(this.x, this.y, this.size));
      }

      p.render();
    }
    
    if (this.particles.length < 50)
      this.particles.push(new Fire(this.x, this.y, size));
  }
}

function Fire(x, y, size) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.vx = 0;
  this.vy = 0;
  this.maxLife = 50;
  this.life = 50;
  this.wind = 0;
  this.rot = 0;
  
  this.update = function() {
    this.life--;
    
    this.x += this.vx;
    this.y += this.vy;
    this.rot += c.random(-10, 10);
    this.x += (c.random(-0.5, 0.5) + this.wind) * this.size/20;
    this.vy -= 0.1 * this.size/20;
  }
  
  this.render = function() {
    //c.circle(this.x, this.y, c.map(this.life, 0, this.maxLife, 0.1, this.size), "rgba(255, " + (200 - this.life * 3) + ", 0," + c.map(this.life, 0, this.maxLife, 0, 1) + ")");
    
    c.ctx.fillStyle = "rgba(255, " + (200 - this.life * 3) + ", 0," + (c.map(this.life, 0, this.maxLife, 0, 1) - 0.3) + ")";
    rotRect(this.x, this.y, c.map(this.life, 0, this.maxLife, 0.1, this.size), c.map(this.life, 0, this.maxLife, 0.1, this.size), this.rot);
  }
}

function rotRect(x,y,width,height,degrees){
  c.ctx.save();
  c.ctx.beginPath();
  c.ctx.translate( x+width/2, y+height/2 );
  c.ctx.rotate(degrees*Math.PI/180);
  c.ctx.rect( -width/2, -height/2, width,height);
  c.ctx.fill();
  c.ctx.restore();

}