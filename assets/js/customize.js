/**
 * BOBA BLOOM — CUSTOMIZE YOUR DRINK JAVASCRIPT (customize.js)
 * Live state manager, step navigation, interactive selectors, and clipboard builder
 */

(function () {
  'use strict';

  // 1. DEFAULT DRINK STATE & HELPERS
  const DEFAULT_STATE = {
    base: 'Classic Milk Tea',
    sweetness: '50% — Balanced',
    sweetnessPercent: 50,
    ice: 'Regular Ice',
    toppings: ['Classic Tapioca Pearls']
  };

  const SWEETNESS_HELPERS = {
    '0%': 'Pure brewed tea flavor with zero added sweetness.',
    '25%': 'A gentle, light hint of sweetness allowing natural tea notes to shine.',
    '50%': 'Our signature house balance — perfectly smooth and moderately sweet.',
    '75%': 'Rich, dessert-like sweetness for extra flavor indulgence.',
    '100%': 'Full, robust sweetness for maximum sweet beverage lovers.'
  };

  let state = {
    base: DEFAULT_STATE.base,
    sweetness: DEFAULT_STATE.sweetness,
    sweetnessPercent: DEFAULT_STATE.sweetnessPercent,
    ice: DEFAULT_STATE.ice,
    toppings: [...DEFAULT_STATE.toppings]
  };

  document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const baseTiles = document.querySelectorAll('.custom-base-tile');
    const selectedBaseLabel = document.getElementById('selected-base-name');
    const sweetnessBtns = document.querySelectorAll('.sweetness-stop-btn');
    const sweetnessTrackFill = document.querySelector('.sweetness-track-fill');
    const sweetnessHelperText = document.getElementById('sweetness-helper-text');
    const iceCards = document.querySelectorAll('.custom-ice-card');
    const toppingTiles = document.querySelectorAll('.custom-topping-tile');
    const toppingsCountEl = document.getElementById('toppings-count');
    const resetToppingsBtn = document.getElementById('btn-reset-toppings');
    
    // Summary Board Elements
    const summaryBaseEl = document.getElementById('summary-base');
    const summarySweetnessEl = document.getElementById('summary-sweetness');
    const summaryIceEl = document.getElementById('summary-ice');
    const summaryToppingsEl = document.getElementById('summary-toppings');
    const btnStartOver = document.getElementById('btn-start-over');
    const btnCopyDrink = document.getElementById('btn-copy-drink');
    const clipboardToast = document.getElementById('clipboard-toast');

    // 2. RENDER LIVE SUMMARY
    function updateSummaryBoard() {
      if (summaryBaseEl) summaryBaseEl.textContent = state.base;
      if (summarySweetnessEl) summarySweetnessEl.textContent = state.sweetness;
      if (summaryIceEl) summaryIceEl.textContent = state.ice;
      if (summaryToppingsEl) {
        summaryToppingsEl.textContent = state.toppings.length > 0 
          ? state.toppings.join(', ') 
          : 'None (Pure Drink)';
      }
      if (selectedBaseLabel) {
        selectedBaseLabel.textContent = state.base;
      }
      if (toppingsCountEl) {
        toppingsCountEl.textContent = state.toppings.length;
      }
    }

    // 3. STEP 01: BASE SELECTION
    baseTiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        const baseName = tile.getAttribute('data-base');
        if (!baseName) return;

        state.base = baseName;
        baseTiles.forEach((t) => t.classList.remove('is-selected'));
        tile.classList.add('is-selected');

        updateSummaryBoard();
      });
    });

    // 4. STEP 02: SWEETNESS SELECTION
    sweetnessBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const percentStr = btn.getAttribute('data-sweetness');
        const percentNum = parseInt(btn.getAttribute('data-percent'), 10) || 50;
        const fullLabel = btn.getAttribute('data-label') || `${percentStr} — Sweet`;

        if (!percentStr) return;

        state.sweetness = fullLabel;
        state.sweetnessPercent = percentNum;

        sweetnessBtns.forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');

        // Update visual progress track
        if (sweetnessTrackFill) {
          sweetnessTrackFill.style.width = `${percentNum}%`;
        }

        // Update helper message
        if (sweetnessHelperText && SWEETNESS_HELPERS[percentStr]) {
          sweetnessHelperText.textContent = SWEETNESS_HELPERS[percentStr];
        }

        updateSummaryBoard();
      });
    });

    // 5. STEP 03: ICE SELECTION
    iceCards.forEach((card) => {
      card.addEventListener('click', () => {
        const iceVal = card.getAttribute('data-ice');
        if (!iceVal) return;

        state.ice = iceVal;
        iceCards.forEach((c) => c.classList.remove('is-selected'));
        card.classList.add('is-selected');

        updateSummaryBoard();
      });
    });

    // 6. STEP 04: TOPPING SELECTION (MULTI-SELECT)
    toppingTiles.forEach((tile) => {
      tile.addEventListener('click', () => {
        const toppingName = tile.getAttribute('data-topping');
        if (!toppingName) return;

        const index = state.toppings.indexOf(toppingName);
        if (index > -1) {
          // Remove topping
          state.toppings.splice(index, 1);
          tile.classList.remove('is-selected');
        } else {
          // Add topping
          state.toppings.push(toppingName);
          tile.classList.add('is-selected');
        }

        updateSummaryBoard();
      });
    });

    // Reset Toppings
    if (resetToppingsBtn) {
      resetToppingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        state.toppings = [];
        toppingTiles.forEach((t) => t.classList.remove('is-selected'));
        updateSummaryBoard();
      });
    }

    // 7. STEP 06: RESET ALL (START OVER)
    if (btnStartOver) {
      btnStartOver.addEventListener('click', (e) => {
        e.preventDefault();
        state = {
          base: DEFAULT_STATE.base,
          sweetness: DEFAULT_STATE.sweetness,
          sweetnessPercent: DEFAULT_STATE.sweetnessPercent,
          ice: DEFAULT_STATE.ice,
          toppings: [...DEFAULT_STATE.toppings]
        };

        // Reset Base UI
        baseTiles.forEach((tile) => {
          tile.classList.toggle('is-selected', tile.getAttribute('data-base') === state.base);
        });

        // Reset Sweetness UI
        sweetnessBtns.forEach((btn) => {
          const isMatch = parseInt(btn.getAttribute('data-percent'), 10) === state.sweetnessPercent;
          btn.classList.toggle('is-selected', isMatch);
        });
        if (sweetnessTrackFill) {
          sweetnessTrackFill.style.width = `${state.sweetnessPercent}%`;
        }
        if (sweetnessHelperText) {
          sweetnessHelperText.textContent = SWEETNESS_HELPERS['50%'];
        }

        // Reset Ice UI
        iceCards.forEach((card) => {
          card.classList.toggle('is-selected', card.getAttribute('data-ice') === state.ice);
        });

        // Reset Toppings UI
        toppingTiles.forEach((tile) => {
          tile.classList.toggle(
            'is-selected', 
            state.toppings.includes(tile.getAttribute('data-topping'))
          );
        });

        updateSummaryBoard();

        // Scroll back to builder
        const builderSec = document.getElementById('drink-builder');
        if (builderSec) {
          builderSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // 8. STEP 06: COPY MY DRINK TO CLIPBOARD
    if (btnCopyDrink) {
      btnCopyDrink.addEventListener('click', async (e) => {
        e.preventDefault();
        const toppingsStr = state.toppings.length > 0 ? state.toppings.join(', ') : 'None';
        const drinkRecipe = `🧋 My BOBA BLOOM Custom Drink:\n• Base: ${state.base}\n• Sweetness: ${state.sweetness}\n• Ice Level: ${state.ice}\n• Toppings: ${toppingsStr}\nA Little Sip of Happiness!`;

        let copied = false;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(drinkRecipe);
            copied = true;
          } catch (err) {}
        }

        // Fallback if clipboard API not available
        if (!copied) {
          try {
            const tempInput = document.createElement('textarea');
            tempInput.value = drinkRecipe;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            copied = true;
          } catch (err) {}
        }

        if (clipboardToast) {
          clipboardToast.textContent = copied
            ? '✓ Drink recipe copied to clipboard! Ready to share or order.'
            : '✓ Drink recipe formatted! Enjoy your custom Boba Bloom creation.';
          clipboardToast.classList.add('show');

          setTimeout(() => {
            clipboardToast.classList.remove('show');
          }, 3500);
        }
      });
    }

    // 9. SMOOTH NAVIGATION BUTTONS
    document.querySelectorAll('[data-goto]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const targetId = btn.getAttribute('data-goto');
        if (targetId) {
          e.preventDefault();
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });

    // Initialize board on load
    updateSummaryBoard();
  });
})();
