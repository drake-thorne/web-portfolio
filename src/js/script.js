// ===================================
// NETWORK TOPOLOGY BACKGROUND
// Nodes connected like a fabric diagram, with packets
// occasionally traveling a link — a nod to the day job.
// ===================================
function initNetworkCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrame;
    let nodes = [];
    let edges = [];
    let pulses = [];

    const NODE_SPACING = 150;
    const LINK_DISTANCE = 190;
    const MAX_LINKS_PER_NODE = 2;
    const PULSE_SPAWN_INTERVAL = 1000;

    let lineColor = 'rgba(255, 255, 255, 0.08)';
    let nodeColor = 'rgba(255, 255, 255, 0.18)';
    let pulseColor = '245, 158, 11';

    function isLightTheme() {
        const attr = document.documentElement.getAttribute('data-theme');
        if (attr === 'light') return true;
        if (attr === 'dark') return false;
        return window.matchMedia('(prefers-color-scheme: light)').matches;
    }

    function refreshPalette() {
        if (isLightTheme()) {
            lineColor = 'rgba(23, 20, 18, 0.10)';
            nodeColor = 'rgba(23, 20, 18, 0.22)';
            pulseColor = '180, 83, 9';
        } else {
            lineColor = 'rgba(255, 255, 255, 0.08)';
            nodeColor = 'rgba(255, 255, 255, 0.18)';
            pulseColor = '245, 158, 11';
        }
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateGraph();
    }

    function generateGraph() {
        nodes = [];
        const cols = Math.max(3, Math.round(canvas.width / NODE_SPACING));
        const rows = Math.max(3, Math.round(canvas.height / NODE_SPACING));
        const cellW = canvas.width / cols;
        const cellH = canvas.height / rows;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                nodes.push({
                    x: i * cellW + cellW / 2 + (Math.random() - 0.5) * cellW * 0.6,
                    y: j * cellH + cellH / 2 + (Math.random() - 0.5) * cellH * 0.6,
                    driftPhase: Math.random() * Math.PI * 2,
                    driftAmp: 4 + Math.random() * 6
                });
            }
        }

        edges = [];
        for (let a = 0; a < nodes.length; a++) {
            const candidates = [];
            for (let b = 0; b < nodes.length; b++) {
                if (a === b) continue;
                const dx = nodes[a].x - nodes[b].x;
                const dy = nodes[a].y - nodes[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DISTANCE) candidates.push({ b, dist });
            }
            candidates.sort((p, q) => p.dist - q.dist);
            candidates.slice(0, MAX_LINKS_PER_NODE).forEach(c => {
                const key = a < c.b ? `${a}-${c.b}` : `${c.b}-${a}`;
                if (!edges.some(e => e.key === key)) {
                    edges.push({ key, a, b: c.b });
                }
            });
        }

        pulses = [];
    }

    function spawnPulse(time) {
        if (!edges.length) return;
        const edge = edges[Math.floor(Math.random() * edges.length)];
        pulses.push({
            edge,
            forward: Math.random() > 0.5,
            start: time,
            duration: 1400 + Math.random() * 1200
        });
    }

    let lastPulseSpawn = 0;
    let lastFrameTime = 0;
    const FRAME_INTERVAL = 1000 / 30; // Cap at 30fps — smooth enough, easy on battery

    function draw(time) {
        animationFrame = requestAnimationFrame(draw);

        const delta = time - lastFrameTime;
        if (delta < FRAME_INTERVAL) return;
        lastFrameTime = time - (delta % FRAME_INTERVAL);

        if (time - lastPulseSpawn > PULSE_SPAWN_INTERVAL) {
            spawnPulse(time);
            lastPulseSpawn = time;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const positions = nodes.map(n => ({
            x: n.x + Math.sin(time * 0.0002 + n.driftPhase) * n.driftAmp,
            y: n.y + Math.cos(time * 0.00016 + n.driftPhase) * n.driftAmp
        }));

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        edges.forEach(edge => {
            const p1 = positions[edge.a];
            const p2 = positions[edge.b];
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        });

        ctx.fillStyle = nodeColor;
        positions.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
            ctx.fill();
        });

        pulses = pulses.filter(pulse => (time - pulse.start) < pulse.duration);
        pulses.forEach(pulse => {
            const t = (time - pulse.start) / pulse.duration;
            const from = pulse.forward ? positions[pulse.edge.a] : positions[pulse.edge.b];
            const to = pulse.forward ? positions[pulse.edge.b] : positions[pulse.edge.a];
            const x = from.x + (to.x - from.x) * t;
            const y = from.y + (to.y - from.y) * t;
            const fade = Math.sin(t * Math.PI);

            ctx.beginPath();
            ctx.arc(x, y, 2.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${pulseColor}, ${0.8 * fade})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${pulseColor}, ${0.15 * fade})`;
            ctx.fill();
        });
    }

    // Pause animation when tab is hidden to save CPU/battery
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrame);
        } else {
            animationFrame = requestAnimationFrame(draw);
        }
    });

    window.addEventListener('resize', resize);
    document.addEventListener('themechange', refreshPalette);
    const lightSchemeQuery = window.matchMedia('(prefers-color-scheme: light)');
    if (lightSchemeQuery.addEventListener) {
        lightSchemeQuery.addEventListener('change', refreshPalette);
    }

    refreshPalette();
    resize();
    animationFrame = requestAnimationFrame(draw);
}

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
        'Networking & DevOps specialist.',
        'Network automation engineer.',
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
    initNetworkCanvas();
    initTypedText();
    initScrollReveal();
    initScrollProgress();
    initSmartHeader();
    initPagesDropdown();
    initBlogFilters();
});
