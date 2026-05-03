 
        document.addEventListener('DOMContentLoaded', () => {
            const menuIcon = document.querySelector('.menuicon');
            const navbar = document.querySelector('.navbar');

            
            if (menuIcon && navbar) {
                menuIcon.addEventListener('click', () => {
                    
                    navbar.classList.toggle('active');
                    
                    
                    const icon = menuIcon.querySelector('i');
                    if (icon) {
                        if (navbar.classList.contains('active')) {
                            icon.classList.remove('bx-menu');
                            icon.classList.add('bx-x');
                        } else {
                            icon.classList.remove('bx-x');
                            icon.classList.add('bx-menu');
                        }
                    }
                });
            }

            
            const navLinks = document.querySelectorAll('.navbar a');

            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    
                    if (window.innerWidth <= 768) { 
                        navbar.classList.remove('active');
                        
                       
                        const icon = menuIcon.querySelector('i');
                        if (icon) {
                            icon.classList.remove('bx-x');
                            icon.classList.add('bx-menu');
                        }
                    }
                });
            });

            // Movable Solar System Interactive Logic
            const aboutSection = document.querySelector('.about');
            const solarSystem = document.querySelector('.solar-system');

            if (aboutSection && solarSystem) {
                aboutSection.addEventListener('mousemove', (e) => {
                    const rect = aboutSection.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    
                    // Apply tilt based on mouse position
                    solarSystem.style.transform = `rotateX(${y * 40}deg) rotateY(${x * 40}deg)`;
                });

                aboutSection.addEventListener('mouseleave', () => {
                    solarSystem.style.transform = `rotateX(0deg) rotateY(0deg)`;
                });
            }

            // Connected Dots (Network) Animation
            const canvas = document.getElementById('particleCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                let particles = [];
                const particleCount = 60;
                const connectionDistance = 120;

                function resize() {
                    canvas.width = canvas.offsetWidth;
                    canvas.height = canvas.offsetHeight;
                }

                window.addEventListener('resize', resize);
                resize();

                class Particle {
                    constructor() {
                        this.init();
                    }
                    init() {
                        this.x = Math.random() * canvas.width;
                        this.y = Math.random() * canvas.height;
                        this.vx = (Math.random() - 0.5) * 0.4;
                        this.vy = (Math.random() - 0.5) * 0.4;
                        this.size = Math.random() * 2 + 1;
                    }
                    update() {
                        this.x += this.vx;
                        this.y += this.vy;
                        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                    }
                    draw() {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }

                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }

                function animate() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    for (let i = 0; i < particles.length; i++) {
                        particles[i].update();
                        particles[i].draw();
                        for (let j = i + 1; j < particles.length; j++) {
                            const dx = particles[i].x - particles[j].x;
                            const dy = particles[i].y - particles[j].y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            if (distance < connectionDistance) {
                                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / connectionDistance - 0.5})`;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(particles[i].x, particles[i].y);
                                ctx.lineTo(particles[j].x, particles[j].y);
                                ctx.stroke();
                            }
                        }
                    }
                    requestAnimationFrame(animate);
                }
                animate();
            }

            // Global Circuit Background Animation
            const globalCanvas = document.getElementById('globalCircuitCanvas');
            if (globalCanvas) {
                const gctx = globalCanvas.getContext('2d');
                let circuits = [];
                const maxCircuits = 25;

                function resizeGlobal() {
                    globalCanvas.width = window.innerWidth;
                    globalCanvas.height = window.innerHeight;
                }
                window.addEventListener('resize', resizeGlobal);
                resizeGlobal();

                class CircuitPath {
                    constructor() {
                        this.init();
                    }
                    init() {
                        this.x = Math.random() * globalCanvas.width;
                        this.y = Math.random() * globalCanvas.height;
                        this.segments = [];
                        this.life = 0;
                        this.maxLife = Math.random() * 200 + 100;
                        this.createSegments();
                    }
                    createSegments() {
                        let curX = this.x;
                        let curY = this.y;
                        const numSegments = Math.floor(Math.random() * 4) + 3;
                        for (let i = 0; i < numSegments; i++) {
                            const length = Math.random() * 60 + 40;
                            // Use multiples of 45 degrees (PI/4) to remove rectangularity
                            // and simulate motherboard trace routing.
                            const angle = (Math.floor(Math.random() * 8) * Math.PI) / 4;
                            
                            curX += Math.cos(angle) * length;
                            curY += Math.sin(angle) * length;
                            this.segments.push({ x: curX, y: curY });
                        }
                    }
                    draw() {
                        const opacity = Math.min(1, (this.maxLife - this.life) / 50);
                        gctx.strokeStyle = `rgba(153, 161, 153, ${opacity * 0.05})`;
                        gctx.lineWidth = 1.2;
                        gctx.beginPath();
                        gctx.moveTo(this.x, this.y);

                        this.segments.forEach(seg => {
                            gctx.lineTo(seg.x, seg.y);
                        });
                        gctx.stroke();

                        // Draw bright nodes at the end
                        const lastSeg = this.segments[this.segments.length - 1];
                        gctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                        gctx.shadowBlur = 4;
                        gctx.shadowColor = "white";
                        gctx.beginPath();
                        gctx.arc(lastSeg.x, lastSeg.y, 2.5, 0, Math.PI * 2);
                        gctx.fill();
                        
                        // Start node
                        gctx.beginPath();
                        gctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                        gctx.fill();
                        
                        gctx.shadowBlur = 0; // Reset for performance
                    }
                    update() {
                        this.life++;
                        if (this.life > this.maxLife) {
                            this.init();
                        }
                    }
                }

                for (let i = 0; i < maxCircuits; i++) {
                    circuits.push(new CircuitPath());
                }

                function animateGlobal() {
                    // Subtle dark overlay effect to maintain readability
                    gctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                    gctx.fillRect(0, 0, globalCanvas.width, globalCanvas.height);
                    
                    circuits.forEach(c => {
                        c.update();
                        c.draw();
                    });
                    requestAnimationFrame(animateGlobal);
                }
                animateGlobal();
            }

            // Role cycling logic for Home section
            const textElement = document.querySelector('.changing-text');
            const roles = [
                "Web Developer", 
                "Graphics Designer", 
                "Multimedia Producer", 
                "App Developer"
            ];
            let currentIndex = 0;

            if (textElement) {
                setInterval(() => {
                    textElement.classList.add('fade-out');
                    setTimeout(() => {
                        currentIndex = (currentIndex + 1) % roles.length;
                        textElement.textContent = roles[currentIndex];
                        textElement.classList.remove('fade-out');
                    }, 1500); // Match the 1.5s CSS transition
                }, 5000); // Increased interval to account for slower animation
            }
        });
    