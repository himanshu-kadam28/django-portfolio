/* ============================================================
   main.js — All interactive behavior for the portfolio.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- 1. Loading screen ---------- */
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('hidden'), 400);
        });
        // Fallback if load already fired
        setTimeout(() => loader.classList.add('hidden'), 1500);
    }

    /* ---------- 2. Theme system with picker ---------- */
const THEME_KEY = 'portfolio-theme';
const DEFAULT_THEME = 'ocean';

const themePicker = document.getElementById('themePicker');
const themePickerBtn = document.getElementById('themePickerBtn');
const themePickerClose = document.getElementById('themePickerClose');
const swatches = document.querySelectorAll('.swatch');

// Apply saved theme (or default) immediately
const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
document.documentElement.setAttribute('data-theme', savedTheme);

// Highlight the active swatch
function markActiveSwatch(theme) {
    swatches.forEach(sw => {
        sw.classList.toggle('active', sw.dataset.themeValue === theme);
    });
}
markActiveSwatch(savedTheme);

// Open/close the picker
if (themePickerBtn && themePicker) {
    themePickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themePicker.classList.toggle('open');
    });
}
if (themePickerClose && themePicker) {
    themePickerClose.addEventListener('click', () => {
        themePicker.classList.remove('open');
    });
}

// Close when clicking outside
document.addEventListener('click', (e) => {
    if (
        themePicker &&
        themePicker.classList.contains('open') &&
        !themePicker.contains(e.target) &&
        themePickerBtn &&
        !themePickerBtn.contains(e.target)
    ) {
        themePicker.classList.remove('open');
    }
});

// Switch theme on swatch click
swatches.forEach(sw => {
    sw.addEventListener('click', () => {
        const theme = sw.dataset.themeValue;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        markActiveSwatch(theme);

        // Auto-close picker on small screens
        if (window.innerWidth < 768 && themePicker) {
            themePicker.classList.remove('open');
        }
    });
});

    /* ---------- 3. Mobile menu ---------- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    /* ---------- 4. Header shadow on scroll ---------- */
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 20);
        }
    });

    /* ---------- 5. Scroll-to-top button ---------- */
    const topBtn = document.getElementById('scrollTop');
    if (topBtn) {
        window.addEventListener('scroll', () => {
            topBtn.classList.toggle('show', window.scrollY > 400);
        });
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- 6. Smooth scrolling for anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const y = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        });
    });

    /* ---------- 7. Typing animation in hero ---------- */
    const typedEl = document.getElementById('typed');
    if (typedEl) {
        const phrases = JSON.parse(typedEl.dataset.phrases || '[]');
        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeLoop() {
            if (!phrases.length) return;
            const current = phrases[phraseIndex];
            if (deleting) {
                charIndex--;
                typedEl.textContent = current.substring(0, charIndex);
                if (charIndex === 0) {
                    deleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(typeLoop, 400);
                    return;
                }
                setTimeout(typeLoop, 40);
            } else {
                charIndex++;
                typedEl.textContent = current.substring(0, charIndex);
                if (charIndex === current.length) {
                    deleting = true;
                    setTimeout(typeLoop, 1800);
                    return;
                }
                setTimeout(typeLoop, 80);
            }
        }
        typeLoop();
    }

    /* ---------- 8. Scroll reveal animations ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));

    /* ---------- 9. Animated skill bars ---------- */
    const skillBars = document.querySelectorAll('.bar > span');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.dataset.percent + '%';
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.4 });
    skillBars.forEach(bar => skillObserver.observe(bar));

    /* ---------- 10. Animated counters ---------- */
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10) || 0;
                const suffix = el.dataset.suffix || '';
                const duration = 1500;
                const start = performance.now();

                function update(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const value = Math.floor(progress * target);
                    el.textContent = value + suffix;
                    if (progress < 1) requestAnimationFrame(update);
                    else el.textContent = target + suffix;
                }
                requestAnimationFrame(update);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    /* ---------- 11. Project filter ---------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('[data-tech]');
    if (filterBtns.length && projectCards.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter.toLowerCase();
                projectCards.forEach(card => {
                    const techs = (card.dataset.tech || '').toLowerCase();
                    const match = filter === 'all' || techs.includes(filter);
                    card.style.display = match ? '' : 'none';
                });
            });
        });
    }

    /* ---------- 12. Contact form loading state ---------- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            const btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            }
        });
    }

});