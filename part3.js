 
        document.addEventListener('DOMContentLoaded', () => {
            const preloader = document.querySelector('.preloader');

            window.addEventListener('load', () => {
                if (preloader) {
                    preloader.classList.add('hidden');
                }
            });

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

            // Active nav link on scroll
            const sections = document.querySelectorAll('section[id]');
            window.addEventListener('scroll', () => {
                const scrollY = window.pageYOffset;

                sections.forEach(current => {
                    const sectionHeight = current.offsetHeight;
                    const sectionTop = current.offsetTop - 150;
                    const sectionId = current.getAttribute('id');

                    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                        document.querySelector('.navbar a[href*=' + sectionId + ']').classList.add('active');
                    } else {
                        document.querySelector('.navbar a[href*=' + sectionId + ']').classList.remove('active');
                    }
                });

                // Special case for home
                if (scrollY < sections[0].offsetTop) {
                     document.querySelector('.navbar a[href*="home"]').classList.add('active');
                }
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

            // Global Connected Dots (Network) Animation
            const canvas = document.getElementById('global-particle-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                let particles = [];
                // Adjust particle count for screen size for better density and performance
                const particleCount = window.innerWidth < 768 ? 150 : 200;
                const connectionDistance = 100; // Slightly reduced connection distance

                // Mouse object for interactivity
                const mouse = {
                    x: null,
                    y: null,
                    radius: 150
                };
                window.addEventListener('mousemove', (event) => {
                    mouse.x = event.x;
                    mouse.y = event.y;
                });
                window.addEventListener('mouseout', () => {
                    mouse.x = null;
                    mouse.y = null;
                });

                function resize() {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
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
                        this.baseSize = Math.random() * 1.2 + 0.5; // Made particles smaller
                        this.size = this.baseSize;
                        this.baseOpacity = Math.random() * 0.4 + 0.1; // Made particles more subtle
                        this.opacity = this.baseOpacity;
                        this.twinkleSpeed = Math.random() * 0.05 + 0.01;
                    }
                    update() {
                        // Mouse interaction: push particles away
                        if (mouse.x) {
                            const dx = this.x - mouse.x;
                            const dy = this.y - mouse.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            if (distance < mouse.radius) {
                                const forceDirectionX = dx / distance;
                                const forceDirectionY = dy / distance;
                                const force = (mouse.radius - distance) / mouse.radius;
                                this.x += forceDirectionX * force * 1.5;
                                this.y += forceDirectionY * force * 1.5;
                            }
                        }

                        this.x += this.vx;
                        this.y += this.vy;
                        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                        // Twinkle effect
                        this.opacity = this.baseOpacity + Math.sin(Date.now() * this.twinkleSpeed) * 0.1;
                    }
                    draw() {
                        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                        // Using blue tones inspired by the "earth" planet for a cohesive look
                        gradient.addColorStop(0, `rgba(100, 180, 255, ${this.opacity})`); // Brighter blue center
                        gradient.addColorStop(1, `rgba(43, 130, 201, ${this.opacity * 0.5})`); // Brighter blue edge

                        ctx.fillStyle = gradient;
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
                                const opacity = Math.max(0, (1 - distance / connectionDistance) * 0.4); // Made lines more subtle
                                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                                ctx.lineWidth = 0.3; // Made lines thinner
                                ctx.beginPath();
                                ctx.moveTo(particles[i].x, particles[i].y);
                                ctx.lineTo(particles[j].x, particles[j].y);
                                ctx.stroke();
                            }
                        }

                        // Draw line to mouse cursor
                        if (mouse.x) {
                            const dx = particles[i].x - mouse.x;
                            const dy = particles[i].y - mouse.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            if (distance < mouse.radius) {
                                const opacity = Math.max(0, (1 - distance / mouse.radius) * 0.3);
                                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                                ctx.beginPath();
                                ctx.moveTo(particles[i].x, particles[i].y);
                                ctx.lineTo(mouse.x, mouse.y);
                                ctx.stroke();
                            }
                        }
                    }
                    requestAnimationFrame(animate);
                }
                animate();
            }

            // Role cycling logic for Home section
            const textElement = document.querySelector('.changing-text');
            const roles = [
                "Web Developer", 
                "Graphics Designer", 
                "Multimedia Producer", 
                "App Developer"
            ];
            let roleIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            if (textElement) {
                const type = () => {
                    const currentRole = roles[roleIndex];
                    let displayText = '';

                    if (isDeleting) {
                        displayText = currentRole.substring(0, charIndex - 1);
                        charIndex--;
                    } else {
                        displayText = currentRole.substring(0, charIndex + 1);
                        charIndex++;
                    }

                    textElement.textContent = displayText;

                    let typingSpeed = isDeleting ? 100 : 200;

                    if (!isDeleting && charIndex === currentRole.length) {
                        typingSpeed = 2000; // Pause after typing
                        isDeleting = true;
                    } else if (isDeleting && charIndex === 0) {
                        isDeleting = false;
                        roleIndex = (roleIndex + 1) % roles.length;
                        typingSpeed = 500; // Pause before typing next word
                    }

                    setTimeout(type, typingSpeed);
                };
                type();
            }
    
            // Key Statistics Counter Animation
            const statsSection = document.querySelector('.stats-section');
            if (statsSection) {
                const counters = document.querySelectorAll('.stat-number');
                const animationDuration = 2000; // 2 seconds for the animation

                const animateCounter = (counter) => {
                    const target = +counter.getAttribute('data-target');
                    let startTime = null;

                    const updateCount = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;
                        const percentage = Math.min(progress / animationDuration, 1);
                        
                        // Apply ease-out effect
                        const easedValue = 1 - Math.pow(1 - percentage, 3);
                        const currentValue = Math.floor(easedValue * target);

                        counter.innerText = `${currentValue}+`;

                        if (progress < animationDuration) {
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = `${target}+`; // Ensure it ends on the exact target
                        }
                    };
                    requestAnimationFrame(updateCount);
                };

                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            counters.forEach(animateCounter);
                            observer.unobserve(entry.target); // Animate only once
                        }
                    });
                }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

                observer.observe(statsSection);
            }

            // Skills Filter Logic
            const filterBtns = document.querySelectorAll('.filter-btn');
            const skillsWrapper = document.querySelector('.skills-grid-wrapper');

            const animateSkill = (skillItem) => {
                const percentageEl = skillItem.querySelector('.skill-percentage');
                const progressFillEl = skillItem.querySelector('.skill-progress-fill');
                const target = +percentageEl.getAttribute('data-progress');
                
                // Reset animations before starting
                progressFillEl.style.width = '0%';
                percentageEl.innerText = '0%';

                // Animate percentage counter
                let current = 0;
                const increment = target / 100; // Control animation speed

                const counterInterval = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(counterInterval);
                    }
                    percentageEl.innerText = `${Math.ceil(current)}%`;
                    // Sync progress bar width with the counter
                    progressFillEl.style.width = `${current}%`;
                }, 15);
            };

            const handleFilterClick = (filter) => {
                const allSkills = skillsWrapper.querySelectorAll('.skill-item');
                allSkills.forEach(item => {
                    // Hide the item first to reset layout and animation
                    item.style.display = 'none';
                    item.classList.remove('visible'); 

                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || filter === category) {
                        setTimeout(() => {
                            item.style.display = 'block'; // Make it part of the layout
                            item.classList.add('visible');
                            animateSkill(item);
                        }, 10); // Small delay for CSS to apply display change before animation
                    }
                });
            };

            if (filterBtns.length > 0 && skillsWrapper) {
                filterBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        filterBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        handleFilterClick(btn.getAttribute('data-filter'));
                    });
                });

                const skillsObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            handleFilterClick('all'); // Animate all on first view
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.2 });

                skillsObserver.observe(skillsWrapper);
            }

            // Testimonial Slider Logic
            const testimonials = [
                {
                    quote: "Yoftahe stands out as an exceptionally driven student who seamlessly pairs a deep understanding of complex software architecture with strong leadership capabilities. His work managing student facility teams and engineering robust system projects reflects a rare combination of technical excellence and outstanding project coordination.",
                    author: "Dr. Elias Tesfaye",
                    title: "Senior Lecturer at Dire Dawa University"
                },
                {
                    quote: "Yoftahe completely elevated our presence by taking a chaotic branding concept and refining it into 10 distinct, sleek minimalist options. The final chosen logo has given our media brand a sharp, contemporary edge that immediately resonates with our digital audience.",
                    author: "Yonas Zerfu",
                    title: "Founder of Tebareku Production"
                },
                {
                    quote: "Working with Yoftahe was a seamless experience. He delivered a high-performance website with a clean, modern UI that exceeded all our expectations. His attention to detail and commitment to quality are truly top-notch.",
                    author: "Alex Johnson",
                    title: "Freelance Client, Tech-Solution"
                }
            ];

            let currentSlide = 0;

            const quoteEl = document.querySelector('.testimonial-quote');
            const authorNameEl = document.querySelector('.testimonial-author-name');
            const authorTitleEl = document.querySelector('.testimonial-author-title');
            const contentEl = document.querySelector('.testimonial-content');
            const dots = document.querySelectorAll('.dot');
            const prevBtn = document.querySelector('.prev-btn');
            const nextBtn = document.querySelector('.next-btn');

            const updateSlider = (index) => {
                const testimonial = testimonials[index];
                contentEl.classList.add('fade');

                setTimeout(() => {
                    quoteEl.textContent = testimonial.quote;
                    authorNameEl.textContent = testimonial.author;
                    authorTitleEl.textContent = testimonial.title;
                    
                    dots.forEach(dot => dot.classList.remove('active'));
                    dots[index].classList.add('active');

                    contentEl.classList.remove('fade');
                }, 400); // Match CSS transition duration
            };

            if (quoteEl && authorNameEl && authorTitleEl && contentEl && dots.length > 0 && prevBtn && nextBtn) {
                if (prevBtn) {
                    prevBtn.addEventListener('click', () => {
                        currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
                        updateSlider(currentSlide);
                    });
                }

                if (nextBtn) {
                    nextBtn.addEventListener('click', () => {
                        currentSlide = (currentSlide + 1) % testimonials.length;
                        updateSlider(currentSlide);
                    });
                }

                dots.forEach(dot => {
                    dot.addEventListener('click', () => {
                        currentSlide = parseInt(dot.getAttribute('data-slide'));
                        updateSlider(currentSlide);
                    });
                });

                // Initialize slider
                updateSlider(currentSlide);
            }
        });