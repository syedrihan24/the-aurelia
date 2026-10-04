// Check for reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Initialize Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

if (!prefersReducedMotion) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
}

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
if (window.innerWidth >= 768 && !prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: 'power2.out'
        });
    });

    const hoverElements = document.querySelectorAll('a, button, .hamburger, .gallery-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursor, { scale: 2, backgroundColor: 'transparent', border: '1px solid var(--gold)', duration: 0.3 });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(cursor, { scale: 1, backgroundColor: 'var(--gold)', border: 'none', duration: 0.3 });
        });
    });
}

// Navbar Hide/Show & Active State
const header = document.getElementById('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;
});

const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('.nav-links li a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === `#${current}`) {
            a.style.color = 'var(--gold)';
        }
    });
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

links.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Scroll Progress Bar Logic
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (windowScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
});

// Animations (only if not reduced motion)
if (!prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // MatchMedia for responsive animations
    let mm = gsap.matchMedia();

    // 1. Hero Reveal & Parallax
    const heroTl = gsap.timeline();
    heroTl.from('.hero h1', { y: 100, opacity: 0, duration: 1.5, ease: 'power4.out', delay: 0.2 })
          .from('.hero p', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1')
          .from('.hero .btn', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8');

    gsap.to('.hero-bg', {
        scale: 1.2,
        y: '20%',
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.hero-content', {
        y: '-30%',
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // 2. About Section (Pinning on Desktop only)
    mm.add("(min-width: 768px)", () => {
        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#about',
                start: 'center center',
                end: '+=800',
                scrub: 1,
                pin: true
            }
        });
        
        aboutTl.to('.about-image img', { scale: 1, duration: 1 })
               .fromTo('.about-line', { y: '100%' }, { y: '0%', stagger: 0.2, duration: 1 }, 0);
    });

    mm.add("(max-width: 767px)", () => {
        gsap.to('.about-image img', {
            scale: 1,
            scrollTrigger: { trigger: '#about', start: 'top 80%', end: 'bottom center', scrub: true }
        });
        gsap.fromTo('.about-line', { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, stagger: 0.1, duration: 1, scrollTrigger: { trigger: '.about-text', start: 'top 80%' }});
    });

    // Counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                const targetValue = +counter.getAttribute('data-target');
                const proxy = { val: 0 };
                gsap.to(proxy, {
                    val: targetValue,
                    duration: 2,
                    onUpdate: function() {
                        counter.innerHTML = Math.ceil(proxy.val);
                    },
                    onComplete: () => {
                        if (targetValue >= 5000) counter.innerHTML += '+';
                    }
                });
            }
        });
    });

    // 3. Gallery Horizontal Scroll (Pinning on Desktop only)
    mm.add("(min-width: 768px)", () => {
        const track = document.querySelector('.gallery-track');
        const scrollAmount = track.offsetWidth - window.innerWidth + 100; // rough calc
        
        gsap.to(track, {
            x: -scrollAmount,
            ease: 'none',
            scrollTrigger: {
                trigger: '.gallery-section',
                start: 'center center',
                end: `+=${scrollAmount}`,
                pin: true,
                scrub: 1
            }
        });

        // Parallax inside frames
        gsap.utils.toArray('.gallery-item img').forEach(img => {
            gsap.to(img, {
                x: '15%', // move right as container moves left
                ease: 'none',
                scrollTrigger: {
                    trigger: '.gallery-section',
                    start: 'center center',
                    end: `+=${scrollAmount}`,
                    scrub: true
                }
            });
        });
    });

    // 4. Menu Stagger
    gsap.utils.toArray('.menu-grid-cards').forEach(grid => {
        gsap.from(grid.querySelectorAll('.menu-card'), {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: grid,
                start: 'top 85%'
            }
        });
    });

    // Rooms Stagger
    gsap.utils.toArray('.rooms-grid').forEach(grid => {
        gsap.from(grid.querySelectorAll('.room-card'), {
            y: 100,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: grid,
                start: 'top 85%'
            }
        });
    });

    // Testimonials Stagger
    gsap.utils.toArray('.testimonials-grid').forEach(grid => {
        gsap.from(grid.querySelectorAll('.testimonial-card'), {
            y: 60,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.5)',
            scrollTrigger: {
                trigger: grid,
                start: 'top 85%'
            }
        });
    });

    // Book Card Zoom In
    gsap.from('.book-card', {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: '.book-section',
            start: 'top 80%'
        }
    });

    // 5. Chef Reveal
    gsap.to('.chef-image', {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1.5,
        ease: 'power4.inOut',
        scrollTrigger: {
            trigger: '.chef-container',
            start: 'top 70%'
        }
    });
    
    gsap.to('.chef-image img', {
        scale: 1,
        duration: 1.5,
        ease: 'power4.inOut',
        scrollTrigger: {
            trigger: '.chef-container',
            start: 'top 70%'
        }
    });

    // Fade quote word by word
    const quote = document.querySelector('.chef-quote');
    const words = quote.innerText.split(' ');
    quote.innerHTML = '';
    words.forEach(word => {
        const span = document.createElement('span');
        span.innerText = word + ' ';
        span.style.opacity = 0;
        quote.appendChild(span);
    });

    gsap.to('.chef-quote span', {
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
        scrollTrigger: {
            trigger: '.chef-quote',
            start: 'top 85%'
        }
    });

    // 6. Contact Form Sequence
    gsap.from('.form-field', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: '.contact-form-container',
            start: 'top 80%'
        }
    });

}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        contactForm.innerHTML = '<h4>Thank you! Your message has been sent.</h4>';
    });
}

// ===================================================================
// HERO PARTICLE SYSTEM (gold dust / sparkles)
// ===================================================================
try {
    if (!prefersReducedMotion) {
        const particleCanvas = document.getElementById('heroParticles');
        if (particleCanvas) {
            const ctx = particleCanvas.getContext('2d');
            const isMobile = window.innerWidth < 768;
            const MAX_PARTICLES = isMobile ? 15 : 35;
            let particles = [];
            let animFrameId = null;
            let isTabVisible = true;

            function resizeCanvas() {
                const hero = document.querySelector('.hero');
                if (hero) {
                    particleCanvas.width = hero.offsetWidth;
                    particleCanvas.height = hero.offsetHeight;
                }
            }

            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);

            class Particle {
                constructor() {
                    this.reset();
                }

                reset() {
                    this.x = Math.random() * particleCanvas.width;
                    this.y = particleCanvas.height + Math.random() * 40;
                    this.size = Math.random() * 3 + 1;
                    this.speedY = -(Math.random() * 0.6 + 0.2);
                    this.speedX = (Math.random() - 0.5) * 0.3;
                    this.opacity = Math.random() * 0.6 + 0.2;
                    this.fadeRate = Math.random() * 0.003 + 0.001;
                    // Gold color variations
                    const goldShift = Math.random() * 40;
                    this.color = `rgba(${201 + goldShift}, ${162 + goldShift}, ${77 + goldShift * 0.5}, `;
                }

                update() {
                    this.y += this.speedY;
                    this.x += this.speedX;
                    this.opacity -= this.fadeRate;

                    if (this.opacity <= 0 || this.y < -10) {
                        this.reset();
                    }
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color + this.opacity + ')';
                    ctx.fill();
                }
            }

            // Initialize particles
            for (let i = 0; i < MAX_PARTICLES; i++) {
                const p = new Particle();
                // Spread initial particles across the canvas height
                p.y = Math.random() * particleCanvas.height;
                particles.push(p);
            }

            function animateParticles() {
                if (!isTabVisible) {
                    animFrameId = null;
                    return;
                }
                ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                animFrameId = requestAnimationFrame(animateParticles);
            }

            // Page Visibility API — pause when tab is hidden
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    isTabVisible = false;
                } else {
                    isTabVisible = true;
                    if (!animFrameId) {
                        animateParticles();
                    }
                }
            });

            // Start animation
            animateParticles();
        }
    }
} catch (e) {
    // Silently fail — the page displays normally without particles
    console.warn('Particle effect failed to initialize:', e);
}
