const COSMIC_CONFIG = {
    bgColorStart: '#05051a',
    bgColorEnd: '#000000',
    starCount: 283,
    starColorA: '#ffffff',
    starColorB: '#a8d8ff',
    starMinSize: 0.5,
    starMaxSize: 2.0,
    meteorColorStart: '#ff4d4d',
    meteorColorEnd: '#ffcc00',
    meteorSpeedMin: 5,
    meteorSpeedMax: 15,
    meteorFrequency: 0.01
};

const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
let w, h;
const stars = [];
const meteors = [];

function setCanvasSize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', setCanvasSize);
setCanvasSize();

class Star {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * (COSMIC_CONFIG.starMaxSize - COSMIC_CONFIG.starMinSize) + COSMIC_CONFIG.starMinSize;
        this.color = Math.random() > 0.5 ? COSMIC_CONFIG.starColorA : COSMIC_CONFIG.starColorB;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
        this.baseSize = this.size;
    }
    update() {
        this.size += this.pulseDir * this.pulseSpeed;
        if (this.size > this.baseSize * 1.5 || this.size < this.baseSize * 0.7) {
            this.pulseDir *= -1;
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.abs(this.size), 0, Math.PI * 2);
        ctx.fill();
    }
}

class Meteor {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * (h * 0.1) - (h * 0.1);
        this.speed = Math.random() * (COSMIC_CONFIG.meteorSpeedMax - COSMIC_CONFIG.meteorSpeedMin) + COSMIC_CONFIG.meteorSpeedMin;
        this.vx = (Math.random() * 2 - 1) * (this.speed * 0.2);
        this.vy = this.speed;
        this.trailLength = Math.random() * 150 + 100;
        this.isFinished = false;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y - this.trailLength > h) this.isFinished = true;
    }
    draw() {
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        const xStart = this.x;
        const yStart = this.y;
        const xEnd = this.x - this.vx * (this.trailLength / this.speed);
        const yEnd = this.y - this.vy * (this.trailLength / this.speed);
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        const gradient = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
        gradient.addColorStop(0, COSMIC_CONFIG.meteorColorStart);
        gradient.addColorStop(1, COSMIC_CONFIG.meteorColorEnd + "00");
        ctx.strokeStyle = gradient;
        ctx.stroke();
        ctx.fillStyle = COSMIC_CONFIG.meteorColorStart;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < COSMIC_CONFIG.starCount; i++) stars.push(new Star());
}

function animate() {
    requestAnimationFrame(animate);
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, COSMIC_CONFIG.bgColorStart);
    gradient.addColorStop(1, COSMIC_CONFIG.bgColorEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    stars.forEach(star => { star.update(); star.draw(); });
    if (Math.random() < COSMIC_CONFIG.meteorFrequency && meteors.length < 5) meteors.push(new Meteor());
    for (let i = meteors.length - 1; i >= 0; i--) {
        meteors[i].update();
        meteors[i].draw();
        if (meteors[i].isFinished) meteors.splice(i, 1);
    }
}

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
}, false);

init();
animate();