/**
 * X Point Fire System - Animation Controller
 * Advanced animations and visual effects
 */

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    init() {
        if (this.isReducedMotion) {
            console.log('Reduced motion preference detected - animations will be minimal');
            return;
        }

        this.initIntersectionObserver();
        this.initParallaxEffects();
        this.initFireAnimations();
        this.initTextAnimations();
        this.initHoverEffects();
        this.bindEvents();

        console.log('Animation Controller initialized');
    }

    bindEvents() {
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 300));
    }

    // Intersection Observer for scroll-triggered animations
    initIntersectionObserver() {
        const observerOptions = {
            threshold: [0, 0.1, 0.5, 1],
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => this.handleIntersection(entry));
        }, observerOptions);

        this.observers.set('main', observer);

        // Observe elements
        this.observeElements();
    }

    observeElements() {
        const observer = this.observers.get('main');

        const selectors = [
            '.service-card',
            '.feature',
            '.hero__content',
            '.section__header',
            '.cta__content',
            '.js-animate'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('js-animate');
                observer.observe(el);
            });
        });
    }

    handleIntersection(entry) {
        if (entry.isIntersecting) {
            const element = entry.target;
            const animationType = element.dataset.animation || 'fadeInUp';
            const delay = parseInt(element.dataset.delay) || 0;

            setTimeout(() => {
                this.animateElement(element, animationType);
            }, delay);

            // Unobserve after animation to prevent re-triggering
            this.observers.get('main').unobserve(element);
        }
    }

    animateElement(element, animationType) {
        element.classList.add('animated', animationType);

        // Remove animation class after completion to allow re-animation if needed
        element.addEventListener('animationend', () => {
            element.classList.remove(animationType);
        }, { once: true });
    }

    // Parallax effects
    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');

        if (parallaxElements.length === 0) return;

        this.parallaxElements = Array.from(parallaxElements).map(el => ({
            element: el,
            speed: parseFloat(el.dataset.speed) || 0.5,
            offset: el.offsetTop
        }));
    }

    updateParallax() {
        if (!this.parallaxElements) return;

        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;

        this.parallaxElements.forEach(({ element, speed, offset }) => {
            const elementTop = offset - scrolled;

            // Only apply parallax when element is in viewport
            if (elementTop < windowHeight && elementTop > -element.offsetHeight) {
                const translateY = (scrolled - offset) * speed;
                element.style.transform = `translate3d(0, ${translateY}px, 0)`;
            }
        });
    }

    // Fire-themed animations
    initFireAnimations() {
        this.createEmberEffects();
        this.initFlameAnimations();
    }

    createEmberEffects() {
        const emberContainers = document.querySelectorAll('.ember-effect');

        emberContainers.forEach(container => {
            this.generateEmbers(container);
        });
    }

    generateEmbers(container) {
        const emberCount = parseInt(container.dataset.emberCount) || 20;

        for (let i = 0; i < emberCount; i++) {
            const ember = document.createElement('div');
            ember.className = 'ember-particle';
            ember.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: radial-gradient(circle, #ffc107, #ff5722);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                animation: ember-float ${3 + Math.random() * 4}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
                opacity: ${0.3 + Math.random() * 0.7};
            `;

            container.appendChild(ember);
        }
    }

    initFlameAnimations() {
        const flameElements = document.querySelectorAll('.flame-animation');

        flameElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.animationDuration = '1s';
            });

            element.addEventListener('mouseleave', () => {
                element.style.animationDuration = '2s';
            });
        });
    }

    // Text animations
    initTextAnimations() {
        this.initTypewriter();
        this.initTextReveal();
        this.initCountUp();
    }

    initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');

        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.borderRight = '2px solid var(--primary-color)';

            this.typeText(element, text, 100);
        });
    }

    typeText(element, text, speed) {
        let index = 0;

        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else {
                // Blinking cursor effect
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 500);
            }
        };

        type();
    }

    initTextReveal() {
        const revealElements = document.querySelectorAll('.text-reveal');

        revealElements.forEach(element => {
            const words = element.textContent.split(' ');
            element.innerHTML = '';

            words.forEach((word, index) => {
                const wordSpan = document.createElement('span');
                wordSpan.textContent = word + ' ';
                wordSpan.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: revealWord 0.6s ease-out forwards;
                    animation-delay: ${index * 0.1}s;
                `;
                element.appendChild(wordSpan);
            });
        });
    }

    initCountUp() {
        const countElements = document.querySelectorAll('.count-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        countElements.forEach(el => observer.observe(el));
    }

    animateCount(element) {
        const target = parseInt(element.dataset.target) || 0;
        const duration = parseInt(element.dataset.duration) || 2000;
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';

        let current = 0;
        const increment = target / (duration / 16);

        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = prefix + target + suffix;
                clearInterval(counter);
            } else {
                element.textContent = prefix + Math.floor(current) + suffix;
            }
        }, 16);
    }

    // Hover effects
    initHoverEffects() {
        this.initMagneticButtons();
        this.initRippleEffect();
        this.initTiltEffect();
    }

    initMagneticButtons() {
        const magneticElements = document.querySelectorAll('.magnetic');

        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }

    initRippleEffect() {
        const rippleElements = document.querySelectorAll('.ripple');

        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const rect = element.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple-effect 0.6s linear;
                    pointer-events: none;
                `;

                element.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    initTiltEffect() {
        const tiltElements = document.querySelectorAll('.tilt');

        tiltElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // Page transition animations
    animatePageEnter() {
        const main = document.querySelector('main');
        if (main) {
            main.classList.add('page-transition');
        }

        // Stagger content sections
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.6s ease-out';

            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200 + 300);
        });
    }

    // Scroll-based animations
    handleScroll() {
        this.updateParallax();
        this.updateScrollProgress();
    }

    updateScrollProgress() {
        const scrollProgress = document.querySelector('.scroll-progress');
        if (scrollProgress) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollProgress.style.width = scrolled + '%';
        }
    }

    handleResize() {
        // Recalculate parallax offsets
        if (this.parallaxElements) {
            this.parallaxElements.forEach(item => {
                item.offset = item.element.offsetTop;
            });
        }
    }

    // Utility methods
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
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

    // Public API
    addAnimation(element, animationType, delay = 0) {
        if (this.isReducedMotion) return;

        setTimeout(() => {
            this.animateElement(element, animationType);
        }, delay);
    }

    removeAllAnimations() {
        document.querySelectorAll('.animated').forEach(el => {
            el.classList.remove('animated');
            el.style.animation = 'none';
        });
    }

    pauseAnimations() {
        document.documentElement.style.setProperty('animation-play-state', 'paused');
    }

    resumeAnimations() {
        document.documentElement.style.setProperty('animation-play-state', 'running');
    }
}

// CSS keyframes injection
const style = document.createElement('style');
style.textContent = `
    @keyframes ember-float {
        0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
        }
    }

    @keyframes revealWord {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes ripple-effect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize animation controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Page transition handler
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
});

window.addEventListener('load', () => {
    if (window.animationController && !window.animationController.isReducedMotion) {
        window.animationController.animatePageEnter();
    }
});