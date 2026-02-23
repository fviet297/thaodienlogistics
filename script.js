/* ============================================
   THẢO ĐIỀN LOGISTICS — Script
   Scroll reveals, navigation, parallax
   ============================================ */

(function () {
  'use strict';

  // --- Intersection Observer for Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // --- Navigation Scroll Behavior ---
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --- Mobile Menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navOverlay = document.getElementById('navOverlay');

  function openMenu() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    navOverlay.style.display = 'block';
    requestAnimationFrame(() => navOverlay.classList.add('visible'));
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    navOverlay.classList.remove('visible');
    setTimeout(() => {
      navOverlay.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navOverlay.addEventListener('click', closeMenu);

  // Close menu on link click
  mobileMenu.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // --- Smooth Scroll for Navigation Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // --- Parallax on Hero Background Text ---
  const heroBgText = document.querySelector('.hero__bg-text');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroBgText && !prefersReducedMotion) {
    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;

            if (scrolled < heroHeight) {
              const translateX = scrolled * 0.15;
              const scale = 1 + scrolled * 0.0003;
              heroBgText.style.transform = `translate(calc(-50% + ${translateX}px), -50%) scale(${scale})`;
            }

            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // --- Stats Counter Animation ---
  const statsNumbers = document.querySelectorAll('.stats__number');

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const finalText = el.textContent;

            const numMatch = finalText.match(/\d+/);
            if (numMatch) {
              const finalNum = parseInt(numMatch[0], 10);
              const prefix = finalText.substring(0, finalText.indexOf(numMatch[0]));
              const suffix = finalText.substring(
                finalText.indexOf(numMatch[0]) + numMatch[0].length
              );

              let current = 0;
              const duration = 1500;
              const startTime = performance.now();

              function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                current = Math.floor(eased * finalNum);
                el.textContent = prefix + current + suffix;

                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  el.textContent = finalText;
                }
              }

              requestAnimationFrame(animate);
            }

            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statsNumbers.forEach((el) => counterObserver.observe(el));
  }
})();
