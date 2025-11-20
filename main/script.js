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

    // Scroll progress indicator
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // Smart Scroll Header
    let lastScrollTop = 0;
    let isNavigating = false;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (isNavigating) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down & passed top threshold
            header.classList.add('header-hidden');
        } else {
            // Scrolling up
            header.classList.remove('header-hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }, { passive: true });
    // Smooth Scroll & Header Logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Hide header on click and block scroll listener
            if (header) {
                header.classList.add('header-hidden');
            }

            isNavigating = true;

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Reset flag after scroll animation completes
                setTimeout(() => {
                    isNavigating = false;
                    // Update lastScrollTop to prevent immediate showing on next small scroll
                    lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                }, 1200);
            }
        });
    });
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
// RESUME PREVIEW MODAL
// ===================================
function showResumePreview() {
    // Create custom modal for resume preview
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 14, 39, 0.95);
        backdrop-filter: blur(8px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
        padding: 2rem;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: rgba(30, 35, 64, 0.9);
        backdrop-filter: blur(16px);
        border: 2px solid rgba(99, 102, 241, 0.3);
        border-radius: 24px;
        padding: 2rem;
        width: 90%;
        max-width: 1000px;
        height: 90vh;
        display: flex;
        flex-direction: column;
        animation: slideUp 0.3s ease;
    `;

    const header = document.createElement('div');
    header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;';

    const title = document.createElement('h3');
    title.style.cssText = 'font-size: 1.5rem; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0;';
    title.textContent = 'Resume Preview';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 1rem;';

    const downloadLink = document.createElement('a');
    downloadLink.href = 'resume.pdf';
    downloadLink.download = 'Drake_Thorne_Resume.pdf';
    downloadLink.style.cssText = 'background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); color: white; border: none; padding: 0.5rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 0.9rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem;';
    downloadLink.innerHTML = '<i class="fas fa-download"></i> Download';

    const closeButton = document.createElement('button');
    closeButton.style.cssText = 'background: rgba(255, 255, 255, 0.1); color: white; border: 2px solid rgba(255, 255, 255, 0.2); padding: 0.5rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 0.9rem;';
    closeButton.textContent = 'Close';
    closeButton.onclick = () => modal.remove();

    const iframe = document.createElement('iframe');
    iframe.src = 'resume.pdf';
    iframe.style.cssText = 'width: 100%; height: 100%; border: none; border-radius: 12px; background: white;';

    buttonContainer.appendChild(downloadLink);
    buttonContainer.appendChild(closeButton);
    header.appendChild(title);
    header.appendChild(buttonContainer);
    modalContent.appendChild(header);
    modalContent.appendChild(iframe);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

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

