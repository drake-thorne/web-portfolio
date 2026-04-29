// ===================================
// DOT-GRID CANVAS BACKGROUND
// ===================================
function initDotGrid() {
    const canvas = document.getElementById('dot-grid');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrame;
    let dots = [];
    const DOT_SPACING = 40;
    const DOT_RADIUS = 1;
    const DOT_COLOR = 'rgba(255, 255, 255, 0.12)';

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateDots();
    }

    function generateDots() {
        dots = [];
        const cols = Math.ceil(canvas.width / DOT_SPACING) + 1;
        const rows = Math.ceil(canvas.height / DOT_SPACING) + 1;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                dots.push({
                    x: i * DOT_SPACING,
                    y: j * DOT_SPACING,
                    baseOpacity: 0.12 + Math.random() * 0.08,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }
    }

    function draw(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        dots.forEach(dot => {
            const pulse = Math.sin(time * 0.001 + dot.phase) * 0.04;
            const opacity = dot.baseOpacity + pulse;
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
        });

        animationFrame = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    animationFrame = requestAnimationFrame(draw);
}

// ===================================
// TYPED TEXT EFFECT
// ===================================
function initTypedText() {
    const element = document.getElementById('typed-text');
    if (!element) return;

    const phrases = [
        'Networking & DevOps specialist.',
        'Network automation enthusiast.',
        'Platform reliability engineer.',
        'Infrastructure as Code expert.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 30 : 60;

        if (!isDeleting && charIndex === currentPhrase.length) {
            delay = 2500; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400; // Pause before next phrase
        }

        timeout = setTimeout(type, delay);
    }

    type();
}




// ===================================
// SCROLL REVEAL OBSERVER
// ===================================
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Stagger children
                const children = entry.target.querySelectorAll('.reveal-child:not(.visible)');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, index * 120);
                });
            }
        });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('section.reveal').forEach(section => {
        observer.observe(section);
    });
}

// ===================================
// SCROLL PROGRESS INDICATOR
// ===================================
function initScrollProgress() {
    const progress = document.querySelector('.scroll-progress');
    if (!progress) return;

    window.addEventListener('scroll', () => {
        const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / winHeight) * 100;
        progress.style.width = scrolled + '%';
    }, { passive: true });
}

// ===================================
// SMART SCROLL HEADER
// ===================================
function initSmartHeader() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollTop = 0;
    let isNavigating = false;

    window.addEventListener('scroll', () => {
        if (isNavigating) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 120) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            if (header) {
                header.classList.add('header-hidden');
            }

            isNavigating = true;

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.classList.add('visible');
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                setTimeout(() => {
                    isNavigating = false;
                    lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                }, 1200);
            }
        });
    });
}

// ===================================
// MAGNETIC HOVER EFFECT
// ===================================
function initMagneticHover() {
    // Only on non-touch
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const cards = document.querySelectorAll('.skill-category, .stat-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            card.style.transform = `translateY(-4px) rotateX(${-y * 0.04}deg) rotateY(${x * 0.04}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

function initPagesDropdown() {
    const wrapper = document.getElementById('pagesDropdown');
    const btn = document.getElementById('pagesBtn');
    const menu = document.getElementById('pagesMenu');
    if (!wrapper || !btn || !menu) return;

    const open = () => { menu.classList.add('open'); btn.classList.add('active'); btn.setAttribute('aria-expanded', 'true'); };
    const close = () => { menu.classList.remove('open'); btn.classList.remove('active'); btn.setAttribute('aria-expanded', 'false'); };

    btn.addEventListener('click', (e) => { e.stopPropagation(); menu.classList.contains('open') ? close() : open(); });
    document.addEventListener('click', (e) => { if (!wrapper.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { close(); btn.focus(); } });
    btn.addEventListener('mousedown', () => {
        btn.blur();
    });
    menu.querySelectorAll('a.pages-menu-item').forEach(item => {
        item.addEventListener('mousedown', () => {
            btn.blur();
        });
    });
    menu.querySelectorAll('a.pages-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            close();
            btn.blur();

            // small delay to let styles settle before navigation
            const href = item.getAttribute('href');
            if (href && !href.startsWith('#')) {
                e.preventDefault();
                setTimeout(() => {
                    window.location.href = href;
                }, 50);
            }
        });
    });
    window.addEventListener('pageshow', () => {
        menu.style.display = '';
        close();
        btn.blur();
        btn.classList.remove('active');
    });
}


// RESUME PREVIEW MODAL


// ===================================
// INITIALIZE ALL
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initDotGrid();
    initTypedText();
    initScrollReveal();
    initScrollProgress();
    initSmartHeader();
    initPagesDropdown();

    // Magnetic hover after a short delay to let layout settle
    setTimeout(initMagneticHover, 500);
});
