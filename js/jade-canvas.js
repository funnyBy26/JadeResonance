const canvas = document.getElementById('jade-canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;

let dotsNum = 60; // 粒子数量
let radius = 4; // 粒子半径（更小）
let fillStyle = 'rgba(180,255,220,0.3)'; // 更高透明度
let lineWidth = 1;
let connection = 120; // 连线最大距离
let followLength = 80; // 鼠标跟随距离

let dots = [];
let animationFrame = null;
let mouseX = null;
let mouseY = null;

function addCanvasSize () {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  dots = [];
  if (animationFrame) window.cancelAnimationFrame(animationFrame);
  initDots(dotsNum);
  moveDots();
}

function mouseMove (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function mouseOut (e) {
  mouseX = null;
  mouseY = null;
}

function mouseClick () {
  for (const dot of dots) dot.elastic();
}

class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speedX = (Math.random() * 2 - 1) * 0.3; // 适中初始速度
    this.speedY = (Math.random() * 2 - 1) * 0.3;
    this.follow = false;
  }
  draw () {
    // 玉石渐变
    let grad = ctx.createRadialGradient(this.x, this.y, radius * 0.3, this.x, this.y, radius);
    grad.addColorStop(0, 'rgba(255,255,255,0.5)');
    grad.addColorStop(0.5, fillStyle);
    grad.addColorStop(1, 'rgba(100,180,140,0.2)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = grad;
    ctx.shadowColor = 'rgba(180,255,220,0.2)';
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();
  }
  move () {
    if (this.x >= width || this.x <= 0) this.speedX = -this.speedX;
    if (this.y >= height || this.y <= 0) this.speedY = -this.speedY;
    this.x += this.speedX;
    this.y += this.speedY;
    // 不再有任何阻尼，粒子持续运动
    this.correct();
    this.draw();
  }
  correct () {
    if (!mouseX || !mouseY) return;
    let lengthX = mouseX - this.x;
    let lengthY = mouseY - this.y;
    const distance = Math.sqrt(lengthX ** 2 + lengthY ** 2);
    if (distance <= followLength) this.follow = true;
    else if (this.follow === true && distance > followLength && distance <= followLength + 8) {
      let proportion = followLength / distance;
      lengthX *= proportion;
      lengthY *= proportion;
      this.x = mouseX - lengthX;
      this.y = mouseY - lengthY;
    } else this.follow = false;
  }
  connectMouse () {
    // 已去除与鼠标的连线
  }
  elastic () {
    let lengthX = mouseX - this.x;
    let lengthY = mouseY - this.y;
    const distance = Math.sqrt(lengthX ** 2 + lengthY ** 2);
    if (distance >= connection) return;
    const rate = 1 - distance / connection;
    this.speedX = 16 * rate * -lengthX / distance; // 弹射速度更快
    this.speedY = 16 * rate * -lengthY / distance;
  }
}

function initDots (num) {
  for (let i = 0; i < num; i++) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const dot = new Dot(x, y);
    dot.draw();
    dots.push(dot);
  }
}

function moveDots () {
  ctx.clearRect(0, 0, width, height);
  for (const dot of dots) {
    dot.move();
  }
  // 已去除所有连线绘制
  animationFrame = window.requestAnimationFrame(moveDots);
}

addCanvasSize();
initDots(dotsNum);
moveDots();

document.onmousemove = mouseMove;
document.onmouseout = mouseOut;
document.onclick = mouseClick;
window.onresize = addCanvasSize;
