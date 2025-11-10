// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive);
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Throttle function for performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

const handleScroll = throttle(() => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}, 10);

// Scroll Progress Indicator
const scrollProgress = document.getElementById('scrollProgress');
const scrollProgressBar = scrollProgress.querySelector('.scroll-progress-bar');

const updateScrollProgress = throttle(() => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgressBar.style.width = scrolled + '%';
    scrollProgress.setAttribute('aria-valuenow', Math.round(scrolled));
}, 10);

// Back to Top Button
const backToTop = document.getElementById('backToTop');

const toggleBackToTop = throttle(() => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}, 100);

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    handleScroll();
    updateScrollProgress();
    toggleBackToTop();
});

// Active navigation link on scroll
const sections = document.querySelectorAll('.section, .hero');
const navLinksArray = Array.from(navLinks);

const updateActiveNav = throttle(() => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', updateActiveNav);

// Smooth scrolling for navigation links
navLinksArray.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Advanced Scroll Reveal Animation (AOS-like)
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }

    init() {
        this.observeElements();
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.elements.forEach(el => {
            observer.observe(el);
        });
    }
}

// Text Reveal Animation
class TextReveal {
    constructor() {
        this.init();
    }

    init() {
        const titles = document.querySelectorAll('.section-title');
        titles.forEach(title => {
            this.animateText(title);
        });
    }

    animateText(element) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    element.style.animation = 'fadeInUp 0.8s ease forwards';
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(element);
    }
}

// Parallax Effect for Hero
class ParallaxHero {
    constructor() {
        this.hero = document.querySelector('.hero');
        if (this.hero) {
            this.init();
        }
    }

    init() {
        const handleParallax = throttle(() => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight && this.hero) {
                const parallaxSpeed = 0.5;
                this.hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        }, 10);

        window.addEventListener('scroll', handleParallax);
    }
}

// Card Tilt Effect (3D)
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.policy-card, .activity-card, .significance-item');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

// Stagger Animation for Lists
class StaggerAnimation {
    constructor() {
        this.init();
    }

    init() {
        const lists = document.querySelectorAll('.activity-list');
        lists.forEach(list => {
            const items = list.querySelectorAll('li');
            items.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                item.style.transition = `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`;
            });

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        items.forEach(item => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(list);
        });
    }
}

// Number Counter Animation
class NumberCounter {
    constructor() {
        this.init();
    }

    init() {
        const numbers = document.querySelectorAll('.value-number, .card-number');
        numbers.forEach(number => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateNumber(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(number);
        });
    }

    animateNumber(element) {
        element.style.animation = 'pulse 0.6s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }
}

// Cursor Effect (Optional - Modern touch)
class CursorEffect {
    constructor() {
        if (window.innerWidth > 768) {
            this.init();
        }
    }

    init() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        const interactiveElements = document.querySelectorAll('a, button, .policy-card, .activity-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
            });
        });
    }
}

// Magnetic Button Effect
class MagneticButton {
    constructor() {
        this.buttons = document.querySelectorAll('.btn-primary');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
}

// News Card Interactions
class NewsCardInteractions {
    constructor() {
        this.cards = document.querySelectorAll('.news-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

// Expandable Content Handler
class ExpandableContent {
    constructor() {
        this.buttons = document.querySelectorAll('.read-more-btn');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-target');
                const content = document.getElementById(targetId);
                
                if (content) {
                    const isActive = content.classList.contains('active');
                    
                    if (isActive) {
                        content.classList.remove('active');
                        button.classList.remove('active');
                        button.textContent = 'Đọc thêm';
                    } else {
                        content.classList.add('active');
                        button.classList.add('active');
                        button.textContent = 'Thu gọn';
                    }
                }
            });
        });
    }
}

// Initialize all animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Scroll Reveal
    new ScrollReveal();
    
    // Initialize Text Reveal
    new TextReveal();
    
    // Initialize Parallax
    new ParallaxHero();
    
    // Initialize Card Tilt
    new CardTilt();
    
    // Initialize Stagger Animation
    new StaggerAnimation();
    
    // Initialize Number Counter
    new NumberCounter();
    
    // Initialize Magnetic Button
    new MagneticButton();
    
    // Initialize News Card Interactions
    new NewsCardInteractions();
    
    // Initialize Expandable Content
    new ExpandableContent();
    
    // Initialize Cursor Effect (optional)
    // new CursorEffect();
});

// Add CSS animation for pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }
    
    .custom-cursor {
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary-color);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        transform: translate(-50%, -50%);
    }
    
    .custom-cursor.cursor-hover {
        transform: translate(-50%, -50%) scale(1.5);
        background: rgba(26, 77, 128, 0.1);
    }
    
    @media (max-width: 768px) {
        .custom-cursor {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Use requestAnimationFrame for smooth animations
let ticking = false;

function updateAnimations() {
    // All scroll-based animations are handled by throttled functions
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateAnimations);
        ticking = true;
    }
});
