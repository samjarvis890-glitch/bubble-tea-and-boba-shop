/**
 * BOBA BLOOM — MAIN JAVASCRIPT
 * Handles Theme Toggling (Dark/Light), RTL/LTR Switching, and Global Utilities
 */

(function () {
  'use strict';

  // 1. THEME MANAGEMENT (Light / Dark Mode)
  const THEME_KEY = 'boba_bloom_theme';
  
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update all theme toggle buttons and icons
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach((btn) => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill';
          btn.setAttribute('aria-label', 'Switch to light mode');
          btn.setAttribute('title', 'Switch to light mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          btn.setAttribute('aria-label', 'Switch to dark mode');
          btn.setAttribute('title', 'Switch to dark mode');
        }
      }
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // 2. DIRECTION MANAGEMENT (RTL / LTR)
  const DIR_KEY = 'boba_bloom_dir';

  function getPreferredDir() {
    return localStorage.getItem(DIR_KEY) || 'ltr';
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem(DIR_KEY, dir);

    // Update RTL buttons
    const rtlButtons = document.querySelectorAll('.rtl-toggle-btn');
    rtlButtons.forEach((btn) => {
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left to Right' : 'Switch to Right to Left');
      btn.setAttribute('title', dir === 'rtl' ? 'LTR View' : 'RTL View');
      const badge = btn.querySelector('.dir-label');
      if (badge) {
        badge.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
    });
  }

  function toggleDir() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    applyDir(newDir);
  }

  // 3. INITIALIZE ON DOM READY
  document.addEventListener('DOMContentLoaded', () => {
    // Apply saved or system preferences
    applyTheme(getPreferredTheme());
    applyDir(getPreferredDir());

    // Attach event listeners to all theme toggle buttons
    document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });

    // Attach event listeners to all RTL toggle buttons
    document.querySelectorAll('.rtl-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', toggleDir);
    });

    // Highlight current page in navbar & drawer
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const cleanPath = (currentPath === '' || currentPath === '/') ? 'index.html' : currentPath;

    document.querySelectorAll('.boba-nav-link, .boba-drawer-link, .boba-dropdown-link, .boba-drawer-sublink').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const baseHref = href.split('#')[0];
      const hasHash = href.includes('#');

      const isExactMatch = href === cleanPath;
      const isBaseMatch = !hasHash && baseHref === cleanPath;

      if (isExactMatch || isBaseMatch) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');

        // If inside desktop dropdown or drawer dropdown, activate parent
        const desktopDropdown = link.closest('.boba-nav-dropdown');
        if (desktopDropdown) {
          const parentToggle = desktopDropdown.querySelector('.boba-nav-link');
          if (parentToggle) parentToggle.classList.add('active');
        }

        const drawerDropdown = link.closest('.boba-drawer-dropdown');
        if (drawerDropdown) {
          drawerDropdown.classList.add('is-expanded');
          const toggleBtn = drawerDropdown.querySelector('.boba-drawer-dropdown-btn');
          if (toggleBtn) {
            toggleBtn.classList.add('active');
            toggleBtn.setAttribute('aria-expanded', 'true');
          }
        }
      } else {
        if (!link.classList.contains('boba-drawer-dropdown-btn')) {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      }
    });
  });
})();
