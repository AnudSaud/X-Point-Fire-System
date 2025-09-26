/**
 * X Point Fire System - Main JavaScript
 * Interactive functionality and animations
 */

class XPointFireSystem {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init() {
        // Initialize components
        this.initNavigation();
        this.initScrollAnimations();
        this.initLazyLoading();
        this.initSmoothScrolling();
        this.initHeaderScrollEffect();

        console.log('X Point Fire System initialized');
    }

    bindEvents() {
        // Window events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 300));
        window.addEventListener('load', this.handleLoad.bind(this));

        // Document events
        document.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded.bind(this));
    }

    // Navigation functionality
    initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const nav = document.getElementById('nav');
        const navLinks = document.querySelectorAll('.nav__link');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                nav.classList.toggle('nav--mobile-open');
                document.body.classList.toggle('nav-open');
            });
        }

        // Close mobile nav when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('nav--mobile-open')) {
                    navToggle.classList.remove('active');
                    nav.classList.remove('nav--mobile-open');
                    document.body.classList.remove('nav-open');
                }
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                nav.classList.remove('nav--mobile-open');
                document.body.classList.remove('nav-open');
            }
        });

        // Active navigation highlight based on current page
        this.setActiveNavigation();
    }

    setActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav__link');

        navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === currentPath ||
                (currentPath === '/' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('nav__link--active');
            }
        });
    }

    // Scroll animations using Intersection Observer
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');

                    // Stagger animations for service cards and features
                    if (entry.target.classList.contains('services__grid') ||
                        entry.target.classList.contains('features__grid')) {
                        this.staggerChildren(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const animatedElements = document.querySelectorAll(
            '.scroll-animate, .service-card, .feature, .hero__content, .section__header'
        );

        animatedElements.forEach(el => {
            el.classList.add('scroll-animate');
            observer.observe(el);
        });
    }

    staggerChildren(container) {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('stagger-item', 'animated');
                child.style.animationDelay = `${index * 0.1}s`;
                child.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }, index * 100);
        });
    }

    // Lazy loading for images
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Smooth scrolling for anchor links
    initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Header scroll effects
    initHeaderScrollEffect() {
        const header = document.querySelector('.header');
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }

            // Hide/show header on scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.classList.add('header--hidden');
            } else {
                header.classList.remove('header--hidden');
            }

            lastScrollTop = scrollTop;
        });
    }

    // Event handlers
    handleScroll() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const transform = `translateY(${scrolled * speed}px)`;
            element.style.transform = transform;
        });
    }

    handleResize() {
        // Handle responsive adjustments
        const nav = document.getElementById('nav');
        const navToggle = document.getElementById('nav-toggle');

        if (window.innerWidth > 1024) {
            nav.classList.remove('nav--mobile-open');
            navToggle.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    }

    handleLoad() {
        // Remove loading states
        document.body.classList.add('loaded');

        // Start hero animations
        this.animateHero();
    }

    handleDOMContentLoaded() {
        // Initialize components that need DOM to be ready
        this.initFormValidation();
        this.initCounterAnimations();
    }

    // Hero section animations
    animateHero() {
        const heroTitle = document.querySelector('.hero__title');
        const heroSubtitle = document.querySelector('.hero__subtitle');
        const heroActions = document.querySelector('.hero__actions');
        const heroImage = document.querySelector('.hero__image');

        if (heroTitle) {
            setTimeout(() => heroTitle.classList.add('fade-in-up'), 300);
        }
        if (heroSubtitle) {
            setTimeout(() => heroSubtitle.classList.add('fade-in-up'), 600);
        }
        if (heroActions) {
            setTimeout(() => heroActions.classList.add('fade-in-up'), 900);
        }
        if (heroImage) {
            setTimeout(() => heroImage.classList.add('fade-in-right'), 1200);
        }
    }

    // Form validation
    initFormValidation() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }

    showFieldError(field, isValid, message) {
        const errorElement = field.nextElementSibling;

        field.classList.toggle('error', !isValid);

        if (!isValid && message) {
            if (errorElement && errorElement.classList.contains('field-error')) {
                errorElement.textContent = message;
            } else {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = message;
                field.parentNode.insertBefore(errorDiv, field.nextSibling);
            }
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('field-error')) {
            errorElement.remove();
        }
    }

    // Counter animations
    initCounterAnimations() {
        const counters = document.querySelectorAll('.counter');

        if (counters.length > 0) {
            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            });

            counters.forEach(counter => {
                counterObserver.observe(counter);
            });
        }
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Utility functions
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

    // Public API methods
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close" type="button">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('notification--show'), 100);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('notification--show');
            setTimeout(() => notification.remove(), 300);
        }, duration);

        // Manual close
        notification.querySelector('.notification__close').addEventListener('click', () => {
            notification.classList.remove('notification--show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const sectionPosition = section.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: sectionPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.xPointFireSystem = new XPointFireSystem();
});

// Global utility functions
window.utils = {
    // Format phone number
    formatPhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{1})(\d{3})(\d{4})$/);
        if (match) {
            return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
        }
        return phone;
    },

    // Validate email
    isValidEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Get current page name
    getCurrentPage: () => {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    },

    // Copy text to clipboard
    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            window.xPointFireSystem.showNotification('Copied to clipboard!', 'success');
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    }
};