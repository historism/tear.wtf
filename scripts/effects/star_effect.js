const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const STAR_COUNT = 150;
const SHOOTING_STAR_INTERVAL = 1500; 
const COLORS = ['#ffffff', '#ff6ab0', '#9933ff', '#0099ff', '#ffff00'];

const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random(),
    speed: Math.random() * 0.01 + 0.00001, 
    growing: Math.random() > 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]
}));

// shooting stars
const shootingStars = [];

function createShootingStar() {
    shootingStars.push({
        x: Math.random() * canvas.width * 0.7,
        y: Math.random() * canvas.height * 0.4,
        length: Math.random() * 120 + 80,
        speed: Math.random() * 10 + 4,
        opacity: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        angle: Math.PI / 5, // 
        trail: []
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        if (star.growing) {
            star.opacity += star.speed;
            if (star.opacity >= 1) star.growing = false;
        } else {
            star.opacity -= star.speed;
            if (star.opacity <= 0) {
                star.growing = true;
                star.x = Math.random() * canvas.width;
                star.y = Math.random() * canvas.height;
                star.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.opacity;
        ctx.fill();
    });

    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];

        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 20) s.trail.shift();

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.02;

        s.trail.forEach((point, index) => {
            const trailOpacity = (index / s.trail.length) * s.opacity;
            const trailSize = (index / s.trail.length) * 2;
            ctx.beginPath();
            ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = trailOpacity;
            ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = s.opacity;
        ctx.fill();

        if (s.opacity <= 0) shootingStars.splice(i, 1);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
}

setInterval(createShootingStar, SHOOTING_STAR_INTERVAL);
createShootingStar(); 
animate();