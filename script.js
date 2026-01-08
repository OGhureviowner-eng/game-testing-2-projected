const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

let score = 0;

// Free sound effects from Mixkit (royalty-free)
const jumpSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-player-jumping-in-a-game-2045.mp3');
const coinSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3');

const gravity = 0.6;
const player = {
    x: 100,
    y: 380,
    width: 60,
    height: 80,
    vx: 0,
    vy: 0,
    speed: 6,
    jumpPower: -16,
    onGround: false
};

const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

const platforms = [
    { x: 0,   y: 460, width: 800, height: 40 }, // ground
    { x: 150, y: 400, width: 200, height: 20 },
    { x: 400, y: 320, width: 180, height: 20 },
    { x: 620, y: 240, width: 160, height: 20 },
    { x: 300, y: 180, width: 120, height: 20 }
];

const coins = [
    { x: 220, y: 360, radius: 15, collected: false },
    { x: 480, y: 280, radius: 15, collected: false },
    { x: 680, y: 200, radius: 15, collected: false },
    { x: 350, y: 140, radius: 15, collected: false },
    { x: 100, y: 300, radius: 15, collected: false }
];

function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#87cefa');
    grad.addColorStop(1, '#e0f7fa');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cute clouds
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(150, 80, 35, 0, Math.PI * 2);
    ctx.arc(190, 80, 45, 0, Math.PI * 2);
    ctx.arc(230, 80, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(550, 120, 40, 0, Math.PI * 2);
    ctx.arc(590, 120, 50, 0, Math.PI * 2);
    ctx.arc(630, 120, 40, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlatforms() {
    ctx.fillStyle = '#ffc0cb';
    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
        ctx.strokeStyle = '#ff69b4';
        ctx.lineWidth = 4;
        ctx.strokeRect(p.x, p.y, p.width, p.height);
    });
}

function drawCoins() {
    coins.forEach(coin => {
        if (coin.collected) return;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffa500';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Kawaii face
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(coin.x - 6, coin.y - 4, 3, 0, Math.PI * 2);
        ctx.arc(coin.x + 6, coin.y - 4, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(coin.x, coin.y + 4, 8, 0, Math.PI);
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function drawPlayer() {
    const px = player.x;
    const py = player.y;

    // Tail
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(px + 50, py + 60);
    ctx.quadraticCurveTo(px + 80, py + 40, px + 65, py + 20);
    ctx.fill();

    // Body
    ctx.fillRect(px + 15, py + 45, 30, 25);

    // Head
    ctx.beginPath();
    ctx.arc(px + 30, py + 30, 25, 0, Math.PI * 2);
    ctx.fill();

    // Ears (inner pink)
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.moveTo(px + 12, py + 18);
    ctx.lineTo(px + 20, py + 5);
    ctx.lineTo(px + 28, py + 18);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(px + 32, py + 18);
    ctx.lineTo(px + 40, py + 5);
    ctx.lineTo(px + 48, py + 18);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(px + 20, py + 25, 6, 0, Math.PI * 2);
    ctx.arc(px + 40, py + 25, 6, 0, Math.PI * 2);
    ctx.fill();

    // Eye shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px + 22, py + 23, 3, 0, Math.PI * 2);
    ctx.arc(px + 42, py + 23, 3, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.arc(px + 30, py + 35, 4, 0, Math.PI * 2);
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px + 5, py + 30);
    ctx.lineTo(px - 15, py + 30);
    ctx.moveTo(px + 55, py + 30);
    ctx.lineTo(px + 75, py + 30);
    ctx.stroke();
}

function update() {
    player.vx = 0;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.vx = -player.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.vx = player.speed;

    if ((keys[' '] || keys['ArrowUp'] || keys['w'] || keys['W']) && player.onGround) {
        player.vy = player.jumpPower;
        jumpSound.currentTime = 0;
        jumpSound.play();
        player.onGround = false;
    }

    player.vy += gravity;
    player.x += player.vx;
    player.y += player.vy;

    // Platform collision (landing on top)
    player.onGround = false;
    for (let p of platforms) {
        if (player.vy >= 0 &&
            player.y + player.height <= p.y + 10 && // was above or on
            player.y + player.height + player.vy >= p.y &&
            player.x + player.width > p.x &&
            player.x < p.x + p.width) {
            player.y = p.y - player.height;
            player.vy = 0;
            player.onGround = true;
        }
    }

    // Boundaries
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Fall reset
    if (player.y > canvas.height) {
        player.x = 100;
        player.y = 380;
        player.vy = 0;
    }

    // Coin collection
    coins.forEach(coin => {
        if (!coin.collected) {
            const dist = Math.hypot(player.x + player.width / 2 - coin.x, player.y + player.height / 2 - coin.y);
            if (dist < 40) {
                coin.collected = true;
                score++;
                scoreElement.textContent = `Score: ${score} ✨`;
                coinSound.currentTime = 0;
                coinSound.play();
            }
        }
    });
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlatforms();
    drawCoins();
    drawPlayer();
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
