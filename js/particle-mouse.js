const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const PARTICLE_NUM = 60;
const particles = [];
let mouse = { x: width / 2, y: height / 2 };
const SCATTER_DIST = 50; // 距离鼠标多少像素内的粒子会被打散

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    // 鼠标移动时，只有靠近鼠标的粒子才会被打散
    for (let p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < SCATTER_DIST) {
            // 给予一个随机方向的初速度
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 2; // 初速度大小
            p.vx += Math.cos(angle) * speed;
            p.vy += Math.sin(angle) * speed;
        }
    }
});

function randomColor() {
    return `rgba(255,255,255,${Math.random() * 0.5 + 0.3})`;
}

for (let i = 0; i < PARTICLE_NUM; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 4 + 2,
        color: randomColor(),
        vx: 0,
        vy: 0
    });
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
        // 速度阻尼
        p.vx *= 0.85;
        p.vy *= 0.85;
        // 鼠标吸引力
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let force = Math.min(0.08, 100 / (dist * dist + 1000));
        p.vx += dx * force;
        p.vy += dy * force;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    }
    requestAnimationFrame(animate);
}
animate(); 