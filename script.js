const header = document.getElementById('header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li a');


// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
links.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Intersection Observer for Scroll Reveal
const revealElements = document.querySelectorAll('.scroll-reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));

// Intersection Observer for Counters
const counters = document.querySelectorAll('.counter');

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const targetValue = +target.getAttribute('data-target');
            let count = 0;
            const duration = 2000; // ms

            // Assume 60fps, so 60 frames per second
            const frames = (duration / 1000) * 60;
            const increment = targetValue / frames;

            const updateCount = () => {
                count += increment;
                if (count < targetValue) {
                    target.innerText = Math.ceil(count);
                    requestAnimationFrame(updateCount);
                } else {
                    target.innerText = targetValue + (targetValue >= 5000 ? '+' : '');
                }
            };

            updateCount();
            observer.unobserve(target);
        }
    });
}, {
    threshold: 0.5
});

counters.forEach(counter => counterObserver.observe(counter));

// Booking Form Logic
const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Hide form fields for simplicity and show thank you message
        const inputs = bookingForm.querySelectorAll('.form-group');
        inputs.forEach(input => input.style.display = 'none');
        bookingForm.querySelector('.btn-submit').style.display = 'none';

        formMessage.style.display = 'block';
        formMessage.innerText = 'Thank you for your request! Our team will contact you shortly to confirm your reservation.';
    });
}

// Back to Top Button Logic
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }

    // Scroll Progress Bar Logic
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (windowScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }
});

