// ===================================
// THEME TOGGLE (dark / light)
// ===================================
function initThemeToggle() {
    const root = document.documentElement;
    const buttons = document.querySelectorAll('.theme-toggle');
    if (!buttons.length) return;

    function getStoredTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            // Storage unavailable (private mode, etc.) — theme just won't persist.
        }
    }

    function currentTheme() {
        const attr = root.getAttribute('data-theme');
        if (attr === 'light' || attr === 'dark') return attr;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme, persist) {
        root.setAttribute('data-theme', theme);

        const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        buttons.forEach(btn => btn.setAttribute('aria-label', label));

        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f6f3' : '#0c0c0c');

        if (persist) setStoredTheme(theme);
        document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    applyTheme(currentTheme(), false);

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
        });
    });

    const lightSchemeQuery = window.matchMedia('(prefers-color-scheme: light)');
    if (lightSchemeQuery.addEventListener) {
        lightSchemeQuery.addEventListener('change', () => {
            if (!getStoredTheme()) applyTheme(currentTheme(), false);
        });
    }
}

// ===================================
// TYPED TEXT EFFECT
// ===================================
function initTypedText() {
    const element = document.getElementById('typed-text');
    if (!element) return;

    const phrases = [
        'Networking & DevOps specialist',
        'Network automation engineer',
        'Platform reliability engineer',
        'Infrastructure as Code expert'
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

function initPagesDropdown() {
    const wrapper = document.getElementById('pagesDropdown');
    const btn = document.getElementById('pagesBtn');
    const menu = document.getElementById('pagesMenu');
    if (!wrapper || !btn || !menu) return;

    const open = () => { menu.classList.add('open'); btn.classList.add('active'); btn.setAttribute('aria-expanded', 'true'); };
    const close = () => { menu.classList.remove('open'); btn.classList.remove('active'); btn.setAttribute('aria-expanded', 'false'); };

    btn.addEventListener('click', (e) => { e.stopPropagation(); menu.classList.contains('open') ? close() : open(); });
    document.addEventListener('click', (e) => { if (!wrapper.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            close();
        }
    });
    btn.addEventListener('mousedown', () => {
        btn.blur();
    });
    menu.querySelectorAll('a.pages-menu-item').forEach(item => {
        item.addEventListener('mousedown', () => {
            btn.blur();   // keep this
        });

        item.addEventListener('click', (e) => {
            close();

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
        close();
        btn.blur();
        btn.classList.remove('active');
    });
}



// ===================================
// BLOG FILTERS
// ===================================
function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.blog-tag');
    const posts = document.querySelectorAll('.blog-post');

    if (!filterBtns.length || !posts.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter').toLowerCase();

            posts.forEach(post => {
                const category = post.getAttribute('data-category').toLowerCase();

                if (filterValue === 'all' || category === filterValue) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
}

// ===================================
// INITIALIZE ALL
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initTypedText();
    initScrollReveal();
    initScrollProgress();
    initSmartHeader();
    initPagesDropdown();
    initBlogFilters();
});
