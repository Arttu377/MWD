// Custom Particles Animation
class ParticlesAnimation {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        
        this.config = {
            particleCount: options.particleCount || 80,
            particleColor: options.particleColor || '#ffffff',
            lineColor: options.lineColor || '#ffffff',
            lineDistance: options.lineDistance || 150,
            particleSpeed: options.particleSpeed || 0.5,
            particleSize: options.particleSize || 3,
            lineOpacity: options.lineOpacity || 0.5,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.setCanvasSize();
        this.createParticles();
        this.animate();
        this.addEventListeners();
    }
    
    setCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                size: Math.random() * this.config.particleSize + 2
            });
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw lines
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.lineDistance) {
                    const opacity = (1 - distance / this.config.lineDistance) * this.config.lineOpacity;
                    this.ctx.strokeStyle = this.hexToRgba(this.config.lineColor, opacity);
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw particles
        this.particles.forEach((particle) => {
            // Mouse interaction
            const dx = particle.x - this.mouse.x;
            const dy = particle.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply friction/damping to slow down particles naturally
            const friction = 0.985;
            particle.vx *= friction;
            particle.vy *= friction;
            
            if (distance < 150 && distance > 0) {
                const force = (150 - distance) / 150;
                // Add repulse effect on top of existing velocity
                particle.vx += (dx / distance) * force * 4.5;
                particle.vy += (dy / distance) * force * 4.5;
            }
            
            // Limit velocity only when mouse interaction happens
            if (distance < 150) {
                particle.vx = Math.max(-6, Math.min(6, particle.vx));
                particle.vy = Math.max(-6, Math.min(6, particle.vy));
            } else {
                // Keep slow velocity for normal movement with minimum speed
                const minSpeed = 0.15;
                const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                if (currentSpeed < minSpeed && currentSpeed > 0) {
                    particle.vx = (particle.vx / currentSpeed) * minSpeed;
                    particle.vy = (particle.vy / currentSpeed) * minSpeed;
                }
                // Limit maximum speed for normal movement
                particle.vx = Math.max(-0.8, Math.min(0.8, particle.vx));
                particle.vy = Math.max(-0.8, Math.min(0.8, particle.vy));
            }
            
            // Boundary check and bounce
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Draw particle
            this.ctx.fillStyle = this.config.particleColor;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
    
    addEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        window.addEventListener('resize', () => {
            this.setCanvasSize();
        });
    }
    
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new ParticlesAnimation('particles-canvas', {
        particleCount: 50,
        particleColor: '#a5b4fc',
        lineColor: '#c7d2fe',
        lineDistance: 150,
        particleSpeed: 0.5,
        particleSize: 3,
        lineOpacity: 0.5
    });
});

