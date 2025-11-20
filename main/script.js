// ===================================
// SCROLL ANIMATION OBSERVER
// ===================================

// Intersection Observer for scroll-based animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Add staggered animation to project cards
    const projects = document.querySelectorAll('.project');
    projects.forEach((project, index) => {
        project.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add parallax effect to profile image
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            profileImage.style.transform = `translateY(${rate}px)`;
        });
    }
});

// ===================================
// COMING SOON ALERT
// ===================================
function showComingSoon() {
    // Create custom modal instead of alert
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 14, 39, 0.9);
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
        backdrop-filter: blur(16px);
        border: 2px solid rgba(99, 102, 241, 0.3);
        border-radius: 24px;
        padding: 3rem;
        text-align: center;
        max-width: 400px;
        animation: slideUp 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <h3 style="font-size: 2rem; margin-bottom: 1rem; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Coming Soon! 🚀</h3>
        <p style="color: #cbd5e1; margin-bottom: 2rem;">This project is currently under development. Stay tuned for updates!</p>
        <button onclick="this.closest('div').parentElement.remove()" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); color: white; border: none; padding: 0.75rem 2rem; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 1rem; transition: transform 0.2s ease;">Got it!</button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ===================================
// SMOOTH SCROLL ENHANCEMENT
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
