class Firework {
    constructor(x, y, targetX, targetY, isInitial = false) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = 2;
        this.angle = Math.atan2(targetY - y, targetX - x);
        this.dx = Math.cos(this.angle) * this.speed;
        this.dy = Math.sin(this.angle) * this.speed;
        this.particles = [];
        this.alive = true;
        this.isInitial = isInitial;
    }

    update(ctx) {
        if (this.alive) {
            this.x += this.dx;
            this.y += this.dy;

            // Draw the firework
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.isInitial ? '#ffd700' : '#fff';
            ctx.fill();

            // Check if firework reached target
            if (Math.abs(this.x - this.targetX) < 5 && Math.abs(this.y - this.targetY) < 5) {
                this.explode();
                this.alive = false;
                
                if (this.isInitial) {
                    // Show the content when initial firework explodes
                    document.getElementById('content').style.display = 'block';
                    // Start regular fireworks
                    startRegularFireworks();
                }
            }
        } else {
            // Update and draw particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const particle = this.particles[i];
                particle.update();
                
                if (particle.alpha <= 0) {
                    this.particles.splice(i, 1);
                } else {
                    particle.draw(ctx);
                }
            }
        }
    }

    explode() {
        const particleCount = this.isInitial ? 150 : 100; // More particles for initial firework
        const angleStep = (Math.PI * 2) / particleCount;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = angleStep * i;
            const speed = this.isInitial ? Math.random() * 3 + 1 : Math.random() * 2;
            this.particles.push(new Particle(
                this.x,
                this.y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                this.isInitial ? '#ffd700' : `hsl(${Math.random() * 360}, 50%, 50%)`
            ));
        }
    }
}

class Particle {
    constructor(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.alpha = 1;
        this.decay = 0.015;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.dy += 0.02; // gravity
        this.alpha -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

// Setup canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const fireworksContainer = document.getElementById('fireworks');
fireworksContainer.appendChild(canvas);

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Animation variables
let fireworks = [];
let lastFireworkTime = 0;
const fireworkInterval = 1000; // Launch a new firework every second

// Hide content initially
document.getElementById('content').style.display = 'none';

// Launch initial firework
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2;
fireworks.push(new Firework(centerX, window.innerHeight, centerX, centerY, true));

function startRegularFireworks() {
    // Show content with animation
    const content = document.getElementById('content');
    content.style.display = 'block';
    // Trigger reflow
    void content.offsetWidth;
    content.classList.add('show');

    // Animation loop for regular fireworks
    function animate(currentTime) {
        requestAnimationFrame(animate);
        
        // Clear canvas with semi-transparent black for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Launch new fireworks
        if (currentTime - lastFireworkTime > fireworkInterval) {
            const startX = Math.random() * canvas.width;
            const startY = canvas.height;
            const targetX = Math.random() * canvas.width;
            const targetY = canvas.height * Math.random() * 0.5;
            
            fireworks.push(new Firework(startX, startY, targetX, targetY, false));
            lastFireworkTime = currentTime;
        }

        // Update and draw fireworks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update(ctx);
            if (fireworks[i].particles.length === 0 && !fireworks[i].alive) {
                fireworks.splice(i, 1);
            }
        }
    }
    animate(0);
}

// Initial animation loop
function initialAnimate() {
    requestAnimationFrame(initialAnimate);
    
    // Clear canvas with semi-transparent black for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update(ctx);
        if (fireworks[i].particles.length === 0 && !fireworks[i].alive) {
            fireworks.splice(i, 1);
        }
    }
}

// Start initial animation
initialAnimate(); 