const canvas = document.getElementById('jade-canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;

let dotsNum = 2220;
let radius = 1.8;
let followLength = 80;
let dots = [];
let animationFrame = null;
let mouseX = null;
let mouseY = null;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  dots = [];
  if (animationFrame) cancelAnimationFrame(animationFrame);
  initDots(dotsNum);
  animateDots();
}

function mouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function mouseOut() {
  mouseX = null;
  mouseY = null;
}

function mouseClick() {
  for (const dot of dots) {
    dot.elastic();
  }
}

class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = radius + Math.random() * 1.2;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
  }

  draw() {
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
    grad.addColorStop(0, 'rgba(255,255,255,0.6)');
    grad.addColorStop(0.5, 'rgba(200,255,240,0.4)');
    grad.addColorStop(1, 'rgba(120,200,170,0.2)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(160,255,220,0.3)';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x <= 0 || this.x >= width) this.speedX = -this.speedX;
    if (this.y <= 0 || this.y >= height) this.speedY = -this.speedY;
    this.followMouse();
    this.draw();
  }

  followMouse() {
    if (mouseX === null || mouseY === null) return;
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < followLength) {
      const force = (1 - dist / followLength) * 0.05;
      this.x += dx * force;
      this.y += dy * force;
    }
  }

  elastic() {
    if (mouseX === null || mouseY === null) return;
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < followLength) {
      const rate = 1 - dist / followLength;
      this.speedX = -dx / dist * 10 * rate;
      this.speedY = -dy / dist * 10 * rate;
    }
  }
}

function initDots(num) {
  for (let i = 0; i < num; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    dots.push(new Dot(x, y));
  }
}

function animateDots() {
  ctx.clearRect(0, 0, width, height);
  for (const dot of dots) {
    dot.move();
  }
  animationFrame = requestAnimationFrame(animateDots);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', mouseMove);
window.addEventListener('mouseout', mouseOut);
window.addEventListener('click', mouseClick);
