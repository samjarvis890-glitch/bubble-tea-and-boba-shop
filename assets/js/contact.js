/**
 * BOBA BLOOM — CONTACT PAGE JAVASCRIPT (contact.js)
 * Brand: BOBA BLOOM
 * Descriptor: BUBBLE TEA & BOBA
 * Tagline: A Little Sip of Happiness.
 * 
 * Manages:
 * 1. Accessible Client-Side Form Validation & Honest Demo Submission Feedback
 * 2. FAQ Accordion (Keyboard & Screen Reader Accessible)
 * 3. Copy-to-Clipboard Email Action
 * 4. Interactive Map Initialization (Leaflet / OpenStreetMap with resilient fallback)
 * 5. Quick Store Notification & Anchor Smooth Scrolling
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. CLIENT-SIDE FORM VALIDATION & DEMO SUBMISSION
  // ==========================================================================
  const contactForm = document.getElementById('boba-contact-form');
  const alertBox = document.getElementById('contact-form-alert');
  const messageInput = document.getElementById('contact-message');
  const charCounter = document.getElementById('message-char-count');

  // Character counter for message textarea
  if (messageInput && charCounter) {
    const updateCount = () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500 characters`;
      if (len > 500) {
        charCounter.classList.add('text-danger');
      } else {
        charCounter.classList.remove('text-danger');
      }
    };
    messageInput.addEventListener('input', updateCount);
    updateCount();
  }

  if (contactForm) {
    const fields = {
      name: document.getElementById('contact-name'),
      email: document.getElementById('contact-email'),
      subject: document.getElementById('contact-subject'),
      message: document.getElementById('contact-message'),
      consent: document.getElementById('contact-consent')
    };

    const errors = {
      name: document.getElementById('name-error'),
      email: document.getElementById('email-error'),
      subject: document.getElementById('subject-error'),
      message: document.getElementById('message-error')
    };

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    };

    const clearErrors = () => {
      Object.keys(fields).forEach(key => {
        const input = fields[key];
        if (input && input.classList) {
          input.classList.remove('is-invalid');
          input.removeAttribute('aria-invalid');
        }
      });
      Object.keys(errors).forEach(key => {
        const err = errors[key];
        if (err) {
          err.textContent = '';
          err.style.display = 'none';
        }
      });
      if (alertBox) {
        alertBox.className = 'contact-alert-box';
        alertBox.innerHTML = '';
        alertBox.style.display = 'none';
      }
    };

    const showError = (fieldKey, message) => {
      const input = fields[fieldKey];
      const errEl = errors[fieldKey];
      if (input) {
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
      }
      if (errEl) {
        errEl.textContent = message;
        errEl.style.display = 'block';
      }
    };

    // Live validation clearing upon typing
    Object.keys(fields).forEach(key => {
      const input = fields[key];
      if (input) {
        input.addEventListener('input', () => {
          if (input.classList.contains('is-invalid')) {
            input.classList.remove('is-invalid');
            input.removeAttribute('aria-invalid');
            if (errors[key]) {
              errors[key].textContent = '';
              errors[key].style.display = 'none';
            }
          }
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;
      let firstInvalid = null;

      // Validate Name
      const nameVal = fields.name ? fields.name.value.trim() : '';
      if (!nameVal || nameVal.length < 2) {
        showError('name', 'Please enter your name (at least 2 letters).');
        isValid = false;
        if (!firstInvalid) firstInvalid = fields.name;
      }

      // Validate Email
      const emailVal = fields.email ? fields.email.value.trim() : '';
      if (!emailVal || !validateEmail(emailVal)) {
        showError('email', 'Please provide a valid email address (e.g. name@example.com).');
        isValid = false;
        if (!firstInvalid) firstInvalid = fields.email;
      }

      // Validate Subject
      const subjectVal = fields.subject ? fields.subject.value : '';
      if (!subjectVal) {
        showError('subject', 'Please choose an inquiry topic.');
        isValid = false;
        if (!firstInvalid) firstInvalid = fields.subject;
      }

      // Validate Message
      const msgVal = fields.message ? fields.message.value.trim() : '';
      if (!msgVal || msgVal.length < 10) {
        showError('message', 'Please share a message of at least 10 characters.');
        isValid = false;
        if (!firstInvalid) firstInvalid = fields.message;
      }

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Visual submission state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Validating...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }

        // Display honest, transparent success confirmation
        if (alertBox) {
          alertBox.className = 'contact-alert-box alert-success show';
          alertBox.innerHTML = `
            <div class="alert-icon"><i class="bi bi-check-circle-fill"></i></div>
            <div class="alert-content">
              <strong>Thank you, ${escapeHtml(nameVal)}! Your note was validated.</strong>
              <p class="mb-1">Topic: <em>${escapeHtml(subjectVal)}</em></p>
              <p class="alert-disclaimer"><i class="bi bi-info-circle me-1"></i><strong>Demo Notice:</strong> This is a static frontend website. Note submissions are validated locally on your device and are not routed to a live backend mail server. To contact our team directly, write to <a href="mailto:hello@bobabloomtea.com" class="text-underline">hello@bobabloomtea.com</a>.</p>
            </div>
          `;
          alertBox.style.display = 'flex';
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset inputs
        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 500 characters';
      }, 700);
    });
  }

  // ==========================================================================
  // 2. COPY TO CLIPBOARD EMAIL HELPER
  // ==========================================================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'hello@bobabloomtea.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for older browsers
          const tempInput = document.createElement('input');
          tempInput.value = email;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<i class="bi bi-check2 me-1"></i> Copied!';
        copyEmailBtn.classList.add('copied');

        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText;
          copyEmailBtn.classList.remove('copied');
        }, 2500);
      } catch (err) {
        console.warn('Clipboard copy failed:', err);
      }
    });
  }

  // ==========================================================================
  // 3. ACCESSIBLE FAQ ACCORDION
  // ==========================================================================
  const faqItems = document.querySelectorAll('.contact-faq-item');
  faqItems.forEach((item) => {
    const header = item.querySelector('.contact-faq-trigger');
    const collapse = item.querySelector('.contact-faq-collapse');

    if (header && collapse) {
      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';

        // Close other FAQ items for a clean single-view accordion
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherHeader = otherItem.querySelector('.contact-faq-trigger');
            const otherCollapse = otherItem.querySelector('.contact-faq-collapse');
            if (otherHeader && otherCollapse) {
              otherHeader.setAttribute('aria-expanded', 'false');
              otherItem.classList.remove('active');
              otherCollapse.style.maxHeight = null;
            }
          }
        });

        // Toggle current item
        if (isExpanded) {
          header.setAttribute('aria-expanded', 'false');
          item.classList.remove('active');
          collapse.style.maxHeight = null;
        } else {
          header.setAttribute('aria-expanded', 'true');
          item.classList.add('active');
          collapse.style.maxHeight = collapse.scrollHeight + 'px';
        }
      });

      // Keyboard accessibility (Space / Enter handled automatically for button,
      // but ensure smooth height update on resize)
      window.addEventListener('resize', () => {
        if (header.getAttribute('aria-expanded') === 'true') {
          collapse.style.maxHeight = collapse.scrollHeight + 'px';
        }
      });
    }
  });

  // Open the first FAQ item by default for inviting exploration
  if (faqItems.length > 0) {
    const firstHeader = faqItems[0].querySelector('.contact-faq-trigger');
    const firstCollapse = faqItems[0].querySelector('.contact-faq-collapse');
    if (firstHeader && firstCollapse) {
      firstHeader.setAttribute('aria-expanded', 'true');
      faqItems[0].classList.add('active');
      firstCollapse.style.maxHeight = firstCollapse.scrollHeight + 'px';
    }
  }

  // ==========================================================================
  // 4. INTERACTIVE STORE MAP (LEAFLET + RESILIENT FALLBACK)
  // ==========================================================================
  const mapElement = document.getElementById('contact-map');
  if (mapElement) {
    // Flagship location coordinates (Vibrant pedestrian downtown sanctuary)
    const storeLat = 37.7749;
    const storeLng = -122.4194;

    const initMap = () => {
      if (typeof L !== 'undefined') {
        try {
          const map = L.map('contact-map', {
            center: [storeLat, storeLng],
            zoom: 14,
            scrollWheelZoom: false,
            zoomControl: false
          });

          // Custom zoom controls in bottom-right corner
          L.control.zoom({ position: 'bottomright' }).addTo(map);

          // Standard OpenStreetMap tiles (100% free, reliable, no API key required)
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          }).addTo(map);

          // Force Leaflet to recalculate container bounds and render all tiles seamlessly
          setTimeout(() => { map.invalidateSize(); }, 150);
          setTimeout(() => { map.invalidateSize(); }, 600);
          window.addEventListener('resize', () => { map.invalidateSize(); });

          // Custom Boba Bloom Cup Marker Pin
          const bobaIcon = L.divIcon({
            className: 'boba-custom-map-pin',
            html: `
              <div class="boba-pin-bubble">
                <i class="bi bi-cup-straw"></i>
                <div class="boba-pin-pulse"></div>
              </div>
            `,
            iconSize: [44, 44],
            iconAnchor: [22, 44],
            popupAnchor: [0, -42]
          });

          const marker = L.marker([storeLat, storeLng], { icon: bobaIcon }).addTo(map);
          marker.bindPopup(`
            <div class="boba-map-popup-card">
              <span class="boba-popup-badge">COMING SOON</span>
              <h4 class="boba-popup-title">BOBA BLOOM FLAGSHIP</h4>
              <p class="boba-popup-sub">Grand Opening Announced Soon</p>
              <p class="boba-popup-info"><i class="bi bi-clock me-1"></i> Projected: 10:00 AM – 9:00 PM</p>
            </div>
          `).openPopup();

          // Reset center on click
          const centerBtn = document.getElementById('map-recenter-btn');
          if (centerBtn) {
            centerBtn.addEventListener('click', () => {
              map.setView([storeLat, storeLng], 14, { animate: true });
              map.invalidateSize();
              marker.openPopup();
            });
          }
        } catch (e) {
          console.warn('Leaflet initialization error, using interactive fallback:', e);
          showFallbackMap();
        }
      } else {
        showFallbackMap();
      }
    };

    const showFallbackMap = () => {
      const fallbackContainer = document.getElementById('contact-map-fallback');
      if (fallbackContainer) {
        fallbackContainer.style.display = 'flex';
      }
    };

    // If Leaflet is loaded immediately or when script finishes
    if (window.L) {
      initMap();
    } else {
      window.addEventListener('load', () => {
        setTimeout(initMap, 200);
      });
    }
  }

  // ==========================================================================
  // 5. NOTIFY ME MODAL / QUICK ACTION
  // ==========================================================================
  const notifyBtn = document.getElementById('store-notify-btn');
  if (notifyBtn) {
    notifyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const subjectSelect = document.getElementById('contact-subject');
      const contactSec = document.getElementById('contact-form');
      if (subjectSelect) {
        subjectSelect.value = 'Store Opening & Location Details';
      }
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const nameField = document.getElementById('contact-name');
        if (nameField) {
          setTimeout(() => nameField.focus(), 500);
        }
      }
    });
  }

  // Helper escape function for security
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
