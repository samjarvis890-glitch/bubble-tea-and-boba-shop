/**
 * BOBA BLOOM — NAVIGATION JAVASCRIPT
 * Accessible Drawer Menu for Mobile & Tablet (Hamburger Menu)
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.boba-hamburger-btn');
    const drawer = document.querySelector('.boba-drawer');
    const backdrop = document.querySelector('.boba-drawer-backdrop');
    const closeBtn = document.querySelector('.boba-drawer-close');
    const drawerNavLinks = document.querySelectorAll('.boba-drawer-link:not(.boba-drawer-dropdown-btn), .boba-drawer-btn, .boba-drawer-sublink');
    const drawerDropdownBtns = document.querySelectorAll('.boba-drawer-dropdown-btn');

    if (!hamburgerBtn || !drawer || !backdrop) return;

    let previouslyFocusedElement = null;

    function openDrawer() {
      previouslyFocusedElement = document.activeElement;
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      hamburgerBtn.classList.add('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      // Focus close button
      if (closeBtn) {
        closeBtn.focus();
      }
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';

      if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
        previouslyFocusedElement.focus();
      }
    }

    hamburgerBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('is-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    backdrop.addEventListener('click', closeDrawer);

    // Toggle submenus inside mobile drawer
    drawerDropdownBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = btn.closest('.boba-drawer-dropdown');
        if (parent) {
          const isExpanded = parent.classList.toggle('is-expanded');
          btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        }
      });
    });

    // Close when a nav link inside drawer is clicked
    drawerNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeDrawer();
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // Trap focus inside drawer when open
    drawer.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const focusables = drawer.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });

    // ------------------------------------------------------------------------
    // LOGIN MODAL CONTROLLER
    // ------------------------------------------------------------------------
    const loginModal = document.getElementById('boba-login-modal');
    const loginBtns = document.querySelectorAll('.boba-login-btn');
    const loginCloseBtn = loginModal ? loginModal.querySelector('.boba-modal-close') : null;
    const loginEmailInput = loginModal ? document.getElementById('login-email') : null;
    let preModalFocus = null;

    function openLoginModal() {
      if (!loginModal) return;
      preModalFocus = document.activeElement;
      if (drawer.classList.contains('is-open')) {
        closeDrawer();
      }
      loginModal.classList.add('is-open');
      loginModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        if (loginEmailInput) {
          loginEmailInput.focus();
        } else if (loginCloseBtn) {
          loginCloseBtn.focus();
        }
      }, 50);
    }

    function closeLoginModal() {
      if (!loginModal) return;
      loginModal.classList.remove('is-open');
      loginModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';

      if (preModalFocus && typeof preModalFocus.focus === 'function') {
        preModalFocus.focus();
      }
    }

    loginBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openLoginModal();
      });
    });

    if (loginCloseBtn) {
      loginCloseBtn.addEventListener('click', closeLoginModal);
    }

    if (loginModal) {
      loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) {
          closeLoginModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && loginModal && loginModal.classList.contains('is-open')) {
        closeLoginModal();
      }
    });
  });
})();
