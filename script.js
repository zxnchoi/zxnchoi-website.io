// Enhanced JavaScript for Portfolio Website
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.querySelector('header');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const heroSubtitle = document.getElementById('rotating-profession');
    const ctaBtn = document.querySelector('.cta-btn');
    const hireBtns = document.querySelectorAll('.hire-btn');
    const aboutBtn = document.querySelector('.about-btn');
    const socialIcons = document.querySelectorAll('.social-icon');

    // Professions for typewriter effect
    const professions = [
        'Future Full-Stack Developer.',
        'Frontend Developer.', 
        'Backend Developer.',
        'Ict Student.',
    ];

    // Typewriter Effect
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;

    function typeWriter() {
        if (!heroSubtitle) return;
        
        const currentProfession = professions[professionIndex];
        
        if (isDeleting) {
            heroSubtitle.innerHTML = "I'm a " + currentProfession.substring(0, charIndex - 1) + '<span class="cursor">|</span>';
            charIndex--;
            typingSpeed = 75;
        } else {
            heroSubtitle.innerHTML = "I'm a " + currentProfession.substring(0, charIndex + 1) + '<span class="cursor">|</span>';
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentProfession.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(typeWriter, typingSpeed);
    }

    // Mobile Menu Toggle
    function toggleMobileMenu() {
        hamburger?.classList.toggle('active');
        navMenu?.classList.toggle('active');
        document.body.style.overflow = navMenu?.classList.contains('active') ? 'hidden' : 'auto';
    }

    // Smooth Scroll Navigation
    function smoothScroll(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header?.offsetHeight || 80;
                const offsetTop = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu
                if (navMenu?.classList.contains('active')) {
                    toggleMobileMenu();
                }

                // Update active state
                updateActiveNavLink(targetId);
            }
        }
    }

    // Update Active Navigation Link
    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeId) {
                link.classList.add('active');
            }
        });
    }

    // Scroll-based Header Effects
    function handleScroll() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }

    // Scroll-based Active Navigation
    function updateActiveNavFromScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + (header?.offsetHeight || 80);

        let activeSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = section;
            }
        });

        if (activeSection) {
            const id = '#' + activeSection.getAttribute('id');
            updateActiveNavLink(id);
            
            // Update URL hash
            if (history.pushState) {
                history.pushState(null, null, id);
            }
        } else if (scrollPosition < 100) {
            updateActiveNavLink('#home');
        }
    }

    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavFromScroll, 50);
    });

    // Intersection Observer for Animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for multiple elements
                const siblings = entry.target.parentElement?.querySelectorAll('.animate-on-scroll');
                if (siblings && siblings.length > 1) {
                    siblings.forEach((sibling, index) => {
                        setTimeout(() => {
                            sibling.style.opacity = '1';
                            sibling.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Setup animations for elements
    function setupAnimations() {
        const animatedElements = document.querySelectorAll(
            '.hero-stats .stat, .about-highlights .highlight, .floating-card, .social-icon'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            el.style.transitionDelay = `${index * 0.1}s`;
            
            animationObserver.observe(el);
        });
    }

    // Button Click Handlers
    function handleButtonClick(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);

        // Add button-specific actions here
        const btnText = button.textContent.trim();

        if (button.classList.contains('cta-btn') || btnText.includes('Talk')) {
            // "Let's Talk" CTA - scroll to contact
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (btnText.includes('Follow')) {
            // "Follow Me" button - open GitHub profile
            window.open('https://github.com/zxnchoi', '_blank');
        } else if (btnText.includes('Download')) {
            // Download CV as .docx
            const cvBase64 = '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';
            const byteChars = atob(cvBase64);
            const byteNums = new Array(byteChars.length);
            for (let i = 0; i < byteChars.length; i++) { byteNums[i] = byteChars.charCodeAt(i); }
            const byteArray = new Uint8Array(byteNums);
            const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Zxnchoi_CV.docx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showNotification('CV downloaded successfully!', 'success');
        }
    }

    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        const iconMap = { info: 'info-circle', success: 'check-circle', error: 'exclamation-circle' };
        const bgMap = { info: 'var(--accent-primary)', success: '#10b981', error: '#ef4444' };
        notification.innerHTML = `
            <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add notification styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: bgMap[type] || 'var(--accent-primary)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Keyboard Navigation
    function handleKeyboard(event) {
        // Close mobile menu on Escape
        if (event.key === 'Escape' && navMenu?.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        // Navigate with arrow keys when menu is open
        if (navMenu?.classList.contains('active') && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault();
            const currentActive = document.querySelector('.nav-link:focus') || document.querySelector('.nav-link.active');
            const navLinksArray = Array.from(navLinks);
            const currentIndex = navLinksArray.indexOf(currentActive);
            
            let nextIndex;
            if (event.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % navLinksArray.length;
            } else {
                nextIndex = currentIndex <= 0 ? navLinksArray.length - 1 : currentIndex - 1;
            }
            
            navLinksArray[nextIndex]?.focus();
        }
    }

    // Performance Optimized Scroll Handler
    let ticking = false;
    function optimizedScrollHandler() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Debounced Resize Handler
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile menu on resize to larger screen
            if (window.innerWidth >= 769 && navMenu?.classList.contains('active')) {
                toggleMobileMenu();
            }
        }, 250);
    }

    // Initialize Active Navigation from Hash
    function initializeActiveNav() {
        const hash = window.location.hash || '#home';
        updateActiveNavLink(hash);
        
        // Smooth scroll to section if hash exists
        if (hash !== '#home') {
            setTimeout(() => {
                const targetElement = document.querySelector(hash);
                if (targetElement) {
                    const headerHeight = header?.offsetHeight || 80;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }, 500);
        }
    }

    // Event Listeners
    hamburger?.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                link.click();
            }
        });
    });

    // Button event listeners
    [ctaBtn, ...hireBtns, aboutBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', handleButtonClick);
        }
    });

    // Social icons hover effects
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Global event listeners
    window.addEventListener('scroll', optimizedScrollHandler);
    window.addEventListener('resize', handleResize);
    window.addEventListener('hashchange', initializeActiveNav);
    document.addEventListener('keydown', handleKeyboard);

    // Handle clicks outside mobile menu
    document.addEventListener('click', (event) => {
        if (navMenu?.classList.contains('active') && 
            !navMenu.contains(event.target) && 
            !hamburger?.contains(event.target)) {
            toggleMobileMenu();
        }
    });

    // Initialize everything
    function init() {
        // Start typewriter effect
        if (heroSubtitle) {
            typeWriter();
        }
        
        // Setup animations
        setupAnimations();
        
        // Initialize navigation
        initializeActiveNav();
        
        // Initial scroll check
        handleScroll();
        
        // Add loaded class for CSS animations
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
        
        console.log('Portfolio website initialized successfully! 🚀');
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Simple validation
            if (!data.name || !data.email || !data.subject || !data.message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Simulate form submission (replace with actual API call)
            console.log('Form submitted:', data);

            // Show success message
            showNotification('Thank you for your message! I will get back to you soon.', 'success');

            // Reset form
            this.reset();
        });
    }

    // Initialize the application
    init();

    // Add CSS for ripple effect and notifications
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        button {
            position: relative;
            overflow: hidden;
        }
        
        .loaded {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        /* Focus styles for accessibility */
        .nav-link:focus-visible,
        .social-icon:focus-visible,
        .hire-btn:focus-visible,
        .cta-btn:focus-visible {
            outline: 2px solid var(--accent-primary);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
});

// Utility Functions
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${pageLoadTime}ms`);
        }, 0);
    });
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

// Service Worker Registration (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you have a service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}