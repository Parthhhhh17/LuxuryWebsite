/* ============================
   NEXUS AI — Interactions
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger siblings slightly
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el, i) => {
        // Add stagger to sibling reveal elements
        const parent = el.parentElement;
        const siblings = parent.querySelectorAll(':scope > .reveal');
        if (siblings.length > 1) {
            const idx = Array.from(siblings).indexOf(el);
            el.dataset.delay = idx * 80;
        }
        revealObserver.observe(el);
    });

    /* ---------- Navbar scroll behavior ---------- */
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    const handleNavScroll = () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // run on load

    /* ---------- Mobile hamburger menu ---------- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navActions = document.querySelector('.navbar__actions');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
            if (navActions) navActions.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
                if (navActions) navActions.classList.remove('open');
            });
        });
    }

    /* ---------- Smooth scroll for anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ---------- Use-case tabs ---------- */
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            // Update active button
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active panel with animation
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            const targetPanel = document.getElementById(`tab-${target}`);
            if (targetPanel) {
                // Small delay to reset animation
                requestAnimationFrame(() => {
                    targetPanel.classList.add('active');
                });
            }
        });
    });

    /* ---------- Animated counter for hero metrics ---------- */
    const animateCounter = (el, target, suffix = '') => {
        const duration = 1800;
        const start = 0;
        const startTime = performance.now();

        const isFloat = target % 1 !== 0;

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (target - start) * eased;

            if (isFloat) {
                el.textContent = current.toFixed(1) + suffix;
            } else {
                el.textContent = Math.floor(current).toLocaleString() + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    // Observe metrics for counter animation
    const metrics = document.querySelectorAll('.metric__number');
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent.trim();

                if (text.includes('K+')) {
                    const num = parseFloat(text.replace('K+', ''));
                    animateCounter(el, num, 'K+');
                } else if (text.includes('%')) {
                    const num = parseFloat(text.replace('%', ''));
                    animateCounter(el, num, '%');
                } else if (text.includes('\u2605')) {
                    const num = parseFloat(text.replace('\u2605', ''));
                    animateCounter(el, num, '\u2605');
                }

                metricsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    metrics.forEach(m => metricsObserver.observe(m));

    /* ---------- Parallax orbs on mouse move ---------- */
    const orbs = document.querySelectorAll('.hero__orb');

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            orbs.forEach((orb, i) => {
                const factor = (i + 1) * 15;
                orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }

    /* ---------- CTA form micro-interaction ---------- */
    const ctaForm = document.querySelector('.cta__form');
    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('ctaEmail');
            const btn = ctaForm.querySelector('.btn');

            if (input && input.value) {
                btn.textContent = '\u2713 You\'re In!';
                btn.style.background = '#22C55E';
                btn.style.color = '#fff';
                input.disabled = true;
                btn.disabled = true;

                setTimeout(() => {
                    btn.textContent = 'Get Started Free';
                    btn.style.background = '';
                    btn.style.color = '';
                    input.disabled = false;
                    btn.disabled = false;
                    input.value = '';
                }, 3000);
            }
        });
    }

    /* ---------- Feature card tilt on hover (desktop) ---------- */
    if (window.matchMedia('(pointer: fine)').matches) {
        const featureCards = document.querySelectorAll('.feature-card');

        featureCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / centerY * -4;
                const rotateY = (x - centerX) / centerX * 4;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

});
