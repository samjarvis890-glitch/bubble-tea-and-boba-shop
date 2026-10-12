/**
 * BOBA BLOOM — MENU PAGE JAVASCRIPT (menu.js)
 * High-performance, jitter-free category navigation and scroll-spy
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const categoryNav = document.querySelector('.menu-category-nav');
    const catLinks = document.querySelectorAll('.menu-cat-link');
    const menuSections = [
      document.getElementById('milk-tea'),
      document.getElementById('fruit-tea'),
      document.getElementById('matcha'),
      document.getElementById('brown-sugar'),
      document.getElementById('toppings')
    ].filter(Boolean);

    if (!catLinks.length || !menuSections.length) return;

    let isManualClick = false;
    let manualClickTimeout = null;

    // Helper: Safely center the active pill inside the horizontal categoryNav bar
    function centerCategoryPill(activeLink) {
      if (!categoryNav || !activeLink) return;
      const navWidth = categoryNav.clientWidth;
      const linkLeft = activeLink.offsetLeft;
      const linkWidth = activeLink.offsetWidth;
      const targetScrollLeft = linkLeft - (navWidth / 2) + (linkWidth / 2);

      categoryNav.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }

    // Helper: Set active category link
    function setActiveCategory(targetId) {
      catLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${targetId}`) {
          link.classList.add('active');
          centerCategoryPill(link);
        } else {
          link.classList.remove('active');
        }
      });
    }

    // 1. Click handling for category navigation tabs
    catLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1);
          const targetSection = document.getElementById(targetId);

          if (targetSection) {
            e.preventDefault();

            // Lock scroll-spy updates during smooth transition
            isManualClick = true;
            if (manualClickTimeout) clearTimeout(manualClickTimeout);

            // Update tab UI immediately
            setActiveCategory(targetId);

            // Smooth scroll using native scrollIntoView which respects CSS scroll-margin-top
            targetSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            // Unlock scroll-spy after scroll completes
            manualClickTimeout = setTimeout(() => {
              isManualClick = false;
            }, 800);
          }
        }
      });
    });

    // 2. Click handling for Hero Index Chips (e.g. .menu-index-chip)
    document.querySelectorAll('.menu-index-chip').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        const href = chip.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1);
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
            e.preventDefault();
            isManualClick = true;
            if (manualClickTimeout) clearTimeout(manualClickTimeout);
            setActiveCategory(targetId);

            targetSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });

            manualClickTimeout = setTimeout(() => {
              isManualClick = false;
            }, 800);
          }
        }
      });
    });

    // 3. Jitter-Free Scroll Spy using IntersectionObserver
    if ('IntersectionObserver' in window) {
      const observerOptions = {
        root: null,
        // Trigger when the section reaches top 30% of viewport below sticky navbar
        rootMargin: '-15% 0px -65% 0px',
        threshold: 0
      };

      const sectionObserver = new IntersectionObserver((entries) => {
        if (isManualClick) return; // Do not fight during active user click scroll

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            setActiveCategory(sectionId);
          }
        });
      }, observerOptions);

      menuSections.forEach((section) => {
        sectionObserver.observe(section);
      });
    }
  });
})();
