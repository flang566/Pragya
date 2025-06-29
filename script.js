let highestZ = 1;

class Paper {
  constructor(paper) {
    this.paper = paper;
    this.holdingPaper = false;
    this.rotating = false;
    this.mouseTouchX = 0;
    this.mouseTouchY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    
    this.paper.style.position = "absolute";
    this.paper.style.transform = `rotateZ(${this.rotation}deg)`;
    
    this.init();
  }
  
  init() {
    // Mouse down
    this.paper.addEventListener('mousedown', (e) => {
      this.start(e.clientX, e.clientY, e.button);
      e.preventDefault();
    });
    
    // Touch start
    this.paper.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.start(touch.clientX, touch.clientY, 0);
    });
    
    // Move mouse
    document.addEventListener('mousemove', (e) => {
      this.move(e.clientX, e.clientY);
    });
    
    // Move touch
    document.addEventListener('touchmove', (e) => {
      if (!this.holdingPaper) return;
      const touch = e.touches[0];
      this.move(touch.clientX, touch.clientY);
    }, { passive: false });
    
    // Release
    window.addEventListener('mouseup', () => this.stop());
    window.addEventListener('touchend', () => this.stop());
  }
  
  start(x, y, button = 0) {
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    
    this.mouseTouchX = x;
    this.mouseTouchY = y;
    this.prevMouseX = x;
    this.prevMouseY = y;
    
    this.paper.style.zIndex = highestZ++;
    if (button === 2) this.rotating = true;
  }
  
  move(x, y) {
    this.mouseX = x;
    this.mouseY = y;
    
    this.velX = this.mouseX - this.prevMouseX;
    this.velY = this.mouseY - this.prevMouseY;
    
    const dirX = this.mouseX - this.mouseTouchX;
    const dirY = this.mouseY - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    
    const dirNormalizedX = dirX / dirLength || 0;
    const dirNormalizedY = dirY / dirLength || 0;
    
    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = (360 + Math.round(180 * angle / Math.PI)) % 360;
    
    if (this.rotating) {
      this.rotation = degrees;
    }
    
    if (this.holdingPaper && !this.rotating) {
      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
    }
    
    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;
    
    if (this.holdingPaper) {
      this.paper.style.transform =
        `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }
  
  stop() {
    this.holdingPaper = false;
    this.rotating = false;
  }
}

// INIT
document.querySelectorAll('.paper').forEach(paper => {
  new Paper(paper);
});