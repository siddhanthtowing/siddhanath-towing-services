// ================================================================
//  SIDDHANATH AUTOMOBILES — script.js
//  All interactions: nav, animations, scroll, mobile menu
// ================================================================

'use strict';

// ----------------------------------------------------------------
// 1. DOM READY — wait for page to fully load
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {

  // ----------------------------------------------------------------
  // 2. AUTO-UPDATE FOOTER YEAR
  // ----------------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ----------------------------------------------------------------
  // 3. STICKY NAVBAR — add 'scrolled' class after scrolling down
  // ----------------------------------------------------------------
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run on load too

  // ----------------------------------------------------------------
  // 4. MOBILE HAMBURGER MENU
  // ----------------------------------------------------------------
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  const allNavLinks = navLinks.querySelectorAll('.nav__link');

  // Toggle menu open/close
  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Animate hamburger lines into X
    hamburger.classList.toggle('is-open', isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when any nav link is clicked
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside (on overlay)
  document.addEventListener('click', function (e) {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  // ----------------------------------------------------------------
  // 5. SCROLL ANIMATIONS — fade-up reveal on scroll
  //    Elements with class "animate-fade-up" animate in when visible
  // ----------------------------------------------------------------
  const animatedEls = document.querySelectorAll('.animate-fade-up');

  function revealOnScroll() {
    animatedEls.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      // Trigger when element is 80px from bottom of viewport
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll(); // Run immediately in case elements are already in view

  // ----------------------------------------------------------------
  // 6. SERVICE CARDS & WHY CARDS — scroll reveal with stagger
  // ----------------------------------------------------------------
  const revealCards = document.querySelectorAll('.service-card, .why-card, .contact-card');

  function revealCards_fn() {
    revealCards.forEach(function (card, index) {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        // Stagger the delay slightly for each card
        setTimeout(function () {
          card.style.opacity     = '1';
          card.style.transform   = 'translateY(0)';
        }, index * 60);
      }
    });
  }

  // Set initial state for cards
  revealCards.forEach(function (card) {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  window.addEventListener('scroll', revealCards_fn, { passive: true });
  revealCards_fn(); // Check on load

  // ----------------------------------------------------------------
  // 7. ACTIVE NAV LINK HIGHLIGHT — highlight link for current section
  // ----------------------------------------------------------------
  const sections  = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav__link');

  function highlightActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinkEls.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Add active nav link style dynamically
  const navStyle = document.createElement('style');
  navStyle.textContent = '.nav__link.active { color: var(--clr-primary) !important; }';
  document.head.appendChild(navStyle);

  window.addEventListener('scroll', highlightActiveNav, { passive: true });
  highlightActiveNav();

  // ----------------------------------------------------------------
  // 8. SCROLL-TO-TOP BUTTON
  // ----------------------------------------------------------------
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ----------------------------------------------------------------
  // 9. HAMBURGER X ANIMATION — style toggle
  //    Adds CSS to transform hamburger to X when open
  // ----------------------------------------------------------------
  const hamStyle = document.createElement('style');
  hamStyle.textContent = `
    .nav__hamburger.is-open span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .nav__hamburger.is-open span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    .nav__hamburger.is-open span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
    .nav__hamburger span {
      transition: transform 0.3s ease, opacity 0.2s ease;
    }
  `;
  document.head.appendChild(hamStyle);

  // ----------------------------------------------------------------
  // 10. SMOOTH SCROLL — for anchor links (backup for older browsers)
  // ----------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId  = this.getAttribute('href');
      const targetEl  = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navH   = navbar ? navbar.offsetHeight : 70;
        const topPos = targetEl.getBoundingClientRect().top + window.scrollY - navH - 10;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }
    });
  });

  // ----------------------------------------------------------------
  // 11. PERFORMANCE: LAZY-LOAD IMAGES (future proofing)
  //     When you add <img loading="lazy" ...> tags, they auto lazy-load.
  //     This JS observer adds additional support for older browsers.
  // ----------------------------------------------------------------
  if ('IntersectionObserver' in window) {
    const lazyImgs = document.querySelectorAll('img[data-src]');
    const imgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    });
    lazyImgs.forEach(function (img) { imgObserver.observe(img); });
  }

  console.log('✅ Siddhanath Automobiles website loaded successfully!');

}); // End DOMContentLoaded
