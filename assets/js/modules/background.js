const canvas = document.getElementById('Background');
const ctx = canvas.getContext('2d');

const DOT_DENSITY = 10000;
const DOT_SPEED = 0.1;
const DOT_OPACITY = [0.2, 0.55];
const DOT_COLOR_1 = '180, 180, 190';
const DOT_COLOR_2 = '240, 240, 255';

const STAR_SPAWN_RATE = 5000;
const STAR_SPEED_X = [2, 5];
const STAR_SPEED_Y = [2, 3];
const STAR_DECAY = [0.0008, 0.0018];

let W, H, dots = [], stars = [];

// --- Helpers ---
const rand = (a, b) => a + Math.random() * (b - a);

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

function spawnDots() {
    const count = Math.floor((W * H) / DOT_DENSITY);
    dots = Array.from({ length: count }, () => ({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(0.5, 2),
        vx: rand(-DOT_SPEED, DOT_SPEED),
        vy: rand(-DOT_SPEED, DOT_SPEED),
        a: rand(DOT_OPACITY[0], DOT_OPACITY[1]),
        grey: Math.random() > 0.5
    }));
}

function spawnStar() {
    stars.push({
        x: rand(-100, W * 0.7),
        y: rand(0, H * 0.4),
        vx: rand(STAR_SPEED_X[0], STAR_SPEED_X[1]),
        vy: rand(STAR_SPEED_Y[0], STAR_SPEED_Y[1]),
        len: rand(80, 180),
        life: 1,
        decay: rand(STAR_DECAY[0], STAR_DECAY[1])
    });
}

function tick() {
    ctx.clearRect(0, 0, W, H);

    for (const d of dots) {
        d.x += d.vx; d.y += d.vy;

        if (d.x < -5) d.x = W + 5;
        if (d.x > W + 5) d.x = -5;
        if (d.y < -5) d.y = H + 5;
        if (d.y > H + 5) d.y = -5;

        const rgb = d.grey ? DOT_COLOR_1 : DOT_COLOR_2;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${d.a})`;
        ctx.fill();
    }

    for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.life -= s.decay;
        if (s.life <= 0) { stars.splice(i, 1); continue; }

        s.x += s.vx; s.y += s.vy;
        const angle = Math.atan2(s.vy, s.vx);
        const tx = s.x - Math.cos(angle) * s.len;
        const ty = s.y - Math.sin(angle) * s.len;

        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,255,255,${s.life * 0.85})`);

        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5 * s.life;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.8 * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.life})`;
        ctx.fill();
    }
    requestAnimationFrame(tick);
}

// --- Init ---
resize();
spawnDots();
setInterval(spawnStar, STAR_SPAWN_RATE);
window.addEventListener('resize', () => { resize(); spawnDots(); });
tick();