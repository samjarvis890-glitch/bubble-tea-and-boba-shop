/**
 * BOBA BLOOM — SHOPPING CART & E-COMMERCE JAVASCRIPT
 * Handles live shopping bag, quick customizer, checkout modal, promo codes, and toasts.
 */

(function () {
  'use strict';

  const CART_KEY = 'boba_bloom_cart';
  const PROMO_KEY = 'boba_bloom_promo';

  // Sample initial items if cart is empty, ensuring an immediate lively shopping experience
  const DEFAULT_CART = [
    {
      id: 'prod-strawberry-cloud',
      title: 'Strawberry Cloud Cream Cap',
      image: 'assets/images/home/signature-strawberry.webp',
      price: 5.75,
      quantity: 1,
      options: 'Large · 50% Sweet · Less Ice · Brown Sugar Boba'
    },
    {
      id: 'prod-brown-sugar',
      title: 'Tiger Brown Sugar Boba',
      image: 'assets/images/home/signature-brown-sugar.webp',
      price: 6.25,
      quantity: 1,
      options: 'Regular · 70% Sweet · Regular Ice · Warm Boba'
    }
  ];

  // Catalog data for Quick Customizer
  const PRODUCTS_CATALOG = {
    'strawberry-cloud': {
      id: 'strawberry-cloud',
      name: 'Strawberry Cloud Cream Cap',
      category: 'Milk Tea & Specialty',
      image: 'assets/images/home/signature-strawberry.webp',
      basePrice: 5.75,
      description: 'Handcrafted fresh strawberry purée, jasmine green tea, with sea-salt cream cap.'
    },
    'brown-sugar': {
      id: 'brown-sugar',
      name: 'Tiger Brown Sugar Boba',
      category: 'Brown Sugar Series',
      image: 'assets/images/home/signature-brown-sugar.webp',
      basePrice: 6.25,
      description: 'Slow-simmered caramelized Taiwanese pearls with organic whole milk and flame-torched cream.'
    },
    'matcha-mood': {
      id: 'matcha-mood',
      name: 'Ceremonial Uji Matcha Latte',
      category: 'Matcha Series',
      image: 'assets/images/home/signature-matcha.webp',
      basePrice: 5.95,
      description: 'First-harvest Kyoto ceremonial matcha stone-ground fresh, layered with oat milk & honey boba.'
    },
    'mango-sunshine': {
      id: 'mango-sunshine',
      name: 'Mango Sunshine Popping Tea',
      category: 'Fruit & Sparkling Tea',
      image: 'assets/images/home/signature-mango.webp',
      basePrice: 5.45,
      description: 'Golden Alphonso mango purée, alpine four-season oolong, bursting mango popping boba.'
    },
    'taro-velvet': {
      id: 'taro-velvet',
      name: 'Taro Lavender Velvet',
      category: 'Milk Tea Series',
      image: 'assets/images/customize/base-taro.webp',
      basePrice: 5.85,
      description: 'Real slow-roasted purple taro paste, coconut milk, and chewy tapioca pearls.'
    },
    'roasted-oolong': {
      id: 'roasted-oolong',
      name: 'Roasted Iron Goddess Oolong Tea',
      category: 'Classic Brew',
      image: 'assets/images/menu/menu-milk-tea.webp',
      basePrice: 5.25,
      description: 'Deep roasted Taiwanese Tieguanyin oolong with grass jelly and brown sugar boba.'
    },
    'peach-lychee': {
      id: 'peach-lychee',
      name: 'White Peach Lychee Sparkler',
      category: 'Fruit Tea',
      image: 'assets/images/customize/base-peach.webp',
      basePrice: 5.50,
      description: 'Sweet white peach nectar, floral lychee pieces, crystal agar boba, and sparkling bubbles.'
    },
    'diy-kit': {
      id: 'diy-kit',
      name: 'Boba Bloom Home DIY Party Kit',
      category: 'DIY & Accessories',
      image: 'assets/images/home/fresh-ingredients.webp',
      basePrice: 19.99,
      description: 'Complete home boba brewing kit for 10 servings with raw tapioca, black tea, syrups, & wide straws.'
    }
  };

  // 1. Storage Helpers
  function getCart() {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [...DEFAULT_CART];
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
    renderCart();
  }

  function getActivePromo() {
    try {
      return JSON.parse(localStorage.getItem(PROMO_KEY));
    } catch (e) {
      return null;
    }
  }

  function saveActivePromo(promo) {
    if (promo) {
      localStorage.setItem(PROMO_KEY, JSON.stringify(promo));
    } else {
      localStorage.removeItem(PROMO_KEY);
    }
  }

  // 2. Toast Notification
  function showToast(message, iconClass = 'bi-check-circle-fill') {
    let toast = document.getElementById('boba-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'boba-toast';
      toast.className = 'boba-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <i class="bi ${iconClass}"></i>
      <span>${message}</span>
    `;
    toast.classList.add('is-visible');

    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }

  // 3. Cart Drawer Management
  const cartDrawer = document.getElementById('boba-cart-drawer');
  const cartBackdrop = document.getElementById('boba-cart-backdrop');
  const cartCloseBtn = document.getElementById('boba-cart-close');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-total');
  const cartDiscountRow = document.getElementById('cart-discount-row');
  const cartDiscountEl = document.getElementById('cart-discount-amount');
  const cartShippingBar = document.getElementById('cart-shipping-bar');
  const cartShippingText = document.getElementById('cart-shipping-text');
  const promoInput = document.getElementById('cart-promo-input');
  const promoApplyBtn = document.getElementById('cart-promo-apply');
  const promoBadgeWrap = document.getElementById('cart-applied-promo');

  function openCart() {
    if (!cartDrawer || !cartBackdrop) return;
    renderCart();
    cartDrawer.classList.add('is-open');
    cartBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (cartCloseBtn) cartCloseBtn.focus();
  }

  function closeCart() {
    if (!cartDrawer || !cartBackdrop) return;
    cartDrawer.classList.remove('is-open');
    cartBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // 4. Cart Rendering
  function renderCart() {
    const cart = getCart();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Update all badge counts across navbar and floating button
    document.querySelectorAll('.boba-cart-badge').forEach((badge) => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon"><i class="bi bi-cup-straw"></i></div>
          <h3>Your Boba Bag is Empty</h3>
          <p>Treat yourself to a little sip of happiness today!</p>
          <a href="#products" class="boba-btn boba-btn-primary boba-btn-sm" onclick="BobaCart.closeCart();">
            <span>BROWSE DRINKS</span>
            <i class="bi bi-arrow-right"></i>
          </a>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '$0.00';
      if (cartTotalEl) cartTotalEl.textContent = '$0.00';
      if (cartDiscountRow) cartDiscountRow.style.display = 'none';
      if (cartShippingBar) cartShippingBar.style.width = '0%';
      if (cartShippingText) cartShippingText.innerHTML = 'Add <strong>$25.00</strong> more for Free Delivery!';
      return;
    }

    // Render items
    let subtotal = 0;
    cartItemsList.innerHTML = cart
      .map((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
          <div class="cart-item" data-index="${index}">
            <div class="cart-item-img">
              <img src="${item.image}" alt="${item.title}" onerror="this.src='assets/images/home/signature-strawberry.webp'">
            </div>
            <div class="cart-item-info">
              <h4 class="cart-item-title">${item.title}</h4>
              <p class="cart-item-options">${item.options || 'Regular'}</p>
              <div class="cart-item-bottom">
                <div class="cart-item-stepper">
                  <button type="button" class="stepper-btn qty-minus" aria-label="Decrease quantity" onclick="BobaCart.changeQty(${index}, -1)">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="stepper-qty">${item.quantity}</span>
                  <button type="button" class="stepper-btn qty-plus" aria-label="Increase quantity" onclick="BobaCart.changeQty(${index}, 1)">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
                <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                <button type="button" class="cart-item-delete" aria-label="Remove item" onclick="BobaCart.removeItem(${index})">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    // Shipping calculation (Threshold $25)
    const threshold = 25.0;
    const progressPercent = Math.min(100, (subtotal / threshold) * 100);
    if (cartShippingBar) cartShippingBar.style.width = `${progressPercent}%`;

    if (cartShippingText) {
      if (subtotal >= threshold) {
        cartShippingText.innerHTML = `🎉 <strong>Congratulations!</strong> You unlocked <strong>FREE Delivery</strong>!`;
      } else {
        const remaining = (threshold - subtotal).toFixed(2);
        cartShippingText.innerHTML = `Add <strong>$${remaining}</strong> more to unlock <strong>Free Delivery</strong>!`;
      }
    }

    // Promo calculation
    const activePromo = getActivePromo();
    let discount = 0;
    if (activePromo && activePromo.code === 'BOBAHAPPY') {
      discount = subtotal * 0.20; // 20% discount
      if (cartDiscountRow) {
        cartDiscountRow.style.display = 'flex';
        if (cartDiscountEl) cartDiscountEl.textContent = `-$${discount.toFixed(2)} (${activePromo.code})`;
      }
      if (promoBadgeWrap) {
        promoBadgeWrap.innerHTML = `
          <div class="applied-promo-pill">
            <i class="bi bi-tag-fill"></i>
            <span>${activePromo.code} (20% OFF)</span>
            <button type="button" onclick="BobaCart.removePromo()">&times;</button>
          </div>
        `;
      }
    } else {
      if (cartDiscountRow) cartDiscountRow.style.display = 'none';
      if (promoBadgeWrap) promoBadgeWrap.innerHTML = '';
    }

    const finalTotal = Math.max(0, subtotal - discount);
    if (cartSubtotalEl) cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
  }

  // 5. Actions
  function addToCart(item) {
    const cart = getCart();
    // Check if duplicate with same options
    const existingIndex = cart.findIndex(
      (c) => c.title === item.title && c.options === item.options
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.quantity || 1;
    } else {
      cart.push({
        id: item.id || `item-${Date.now()}`,
        title: item.title,
        image: item.image,
        price: parseFloat(item.price) || 5.0,
        quantity: item.quantity || 1,
        options: item.options || 'Regular'
      });
    }

    saveCart(cart);
    showToast(`Added <strong>${item.title}</strong> to your bag!`, 'bi-bag-check-fill');
  }

  function changeQty(index, delta) {
    const cart = getCart();
    if (cart[index]) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      saveCart(cart);
    }
  }

  function removeItem(index) {
    const cart = getCart();
    if (cart[index]) {
      const removed = cart[index].title;
      cart.splice(index, 1);
      saveCart(cart);
      showToast(`Removed ${removed} from bag`, 'bi-trash');
    }
  }

  function applyPromo(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'BOBAHAPPY') {
      saveActivePromo({ code: 'BOBAHAPPY', rate: 0.20 });
      showToast('Promo code BOBAHAPPY applied! 20% discount added.', 'bi-patch-check-fill');
      if (promoInput) promoInput.value = '';
      renderCart();
    } else if (cleanCode === '') {
      showToast('Please enter a coupon code.', 'bi-exclamation-circle-fill');
    } else {
      showToast('Invalid coupon code. Try BOBAHAPPY for 20% off!', 'bi-x-circle-fill');
    }
  }

  function removePromo() {
    saveActivePromo(null);
    showToast('Promo code removed', 'bi-info-circle-fill');
    renderCart();
  }

  // 6. Quick Customizer Modal
  const customizeModal = document.getElementById('boba-customize-modal');
  let currentCustomizingProduct = null;

  function openCustomizeModal(productKey) {
    const product = PRODUCTS_CATALOG[productKey] || {
      id: productKey,
      name: 'Signature Boba Drink',
      category: 'Handcrafted Tea',
      image: 'assets/images/home/signature-strawberry.webp',
      basePrice: 5.75,
      description: 'Custom handcrafted bubble tea made fresh to order.'
    };

    currentCustomizingProduct = product;
    if (!customizeModal) return;

    // Populate modal fields
    const imgEl = document.getElementById('custom-modal-img');
    const titleEl = document.getElementById('custom-modal-title');
    const catEl = document.getElementById('custom-modal-cat');
    const descEl = document.getElementById('custom-modal-desc');
    const priceEl = document.getElementById('custom-modal-price');

    if (imgEl) imgEl.src = product.image;
    if (titleEl) titleEl.textContent = product.name;
    if (catEl) catEl.textContent = product.category;
    if (descEl) descEl.textContent = product.description;
    if (priceEl) priceEl.textContent = `$${product.basePrice.toFixed(2)}`;

    // Reset default form inputs
    const form = document.getElementById('custom-drink-form');
    if (form) form.reset();

    // Recalculate price
    updateCustomModalPrice();

    customizeModal.classList.add('is-open');
    customizeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCustomizeModal() {
    if (!customizeModal) return;
    customizeModal.classList.remove('is-open');
    customizeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateCustomModalPrice() {
    if (!currentCustomizingProduct) return;
    let price = currentCustomizingProduct.basePrice;

    // Size
    const sizeInput = document.querySelector('input[name="custom-size"]:checked');
    if (sizeInput && sizeInput.value === 'large') {
      price += 0.75;
    }

    // Milk
    const milkInput = document.querySelector('input[name="custom-milk"]:checked');
    if (milkInput && (milkInput.value === 'oat' || milkInput.value === 'almond')) {
      price += 0.50;
    }

    // Toppings
    document.querySelectorAll('input[name="custom-toppings"]:checked').forEach((top) => {
      price += parseFloat(top.getAttribute('data-price') || '0.75');
    });

    const priceBtn = document.getElementById('custom-modal-add-btn');
    if (priceBtn) {
      priceBtn.innerHTML = `
        <i class="bi bi-bag-plus"></i>
        <span>Add to Bag • $${price.toFixed(2)}</span>
      `;
    }
  }

  function submitCustomDrink() {
    if (!currentCustomizingProduct) return;

    const sizeInput = document.querySelector('input[name="custom-size"]:checked');
    const sweetnessInput = document.querySelector('input[name="custom-sweetness"]:checked');
    const iceInput = document.querySelector('input[name="custom-ice"]:checked');
    const milkInput = document.querySelector('input[name="custom-milk"]:checked');

    const toppings = [];
    document.querySelectorAll('input[name="custom-toppings"]:checked').forEach((top) => {
      toppings.push(top.value);
    });

    const size = sizeInput ? sizeInput.value.toUpperCase() : 'REGULAR';
    const sweet = sweetnessInput ? sweetnessInput.value : '50% Sweet';
    const ice = iceInput ? iceInput.value : 'Less Ice';
    const milk = milkInput ? milkInput.value : 'Whole Milk';

    const toppingText = toppings.length > 0 ? toppings.join(', ') : 'No extra toppings';
    const optionsSummary = `${size} · ${sweet} · ${ice} · ${milk} · ${toppingText}`;

    // Price
    let finalPrice = currentCustomizingProduct.basePrice;
    if (sizeInput && sizeInput.value === 'large') finalPrice += 0.75;
    if (milkInput && (milkInput.value === 'oat' || milkInput.value === 'almond')) finalPrice += 0.50;
    toppings.forEach(() => {
      finalPrice += 0.75;
    });

    addToCart({
      id: `${currentCustomizingProduct.id}-${Date.now()}`,
      title: currentCustomizingProduct.name,
      image: currentCustomizingProduct.image,
      price: finalPrice,
      quantity: 1,
      options: optionsSummary
    });

    closeCustomizeModal();
    openCart();
  }

  // 7. Checkout Modal
  const checkoutModal = document.getElementById('boba-checkout-modal');

  function openCheckoutModal() {
    const cart = getCart();
    if (cart.length === 0) {
      showToast('Your bag is empty! Add drinks before checking out.', 'bi-bag-x');
      return;
    }

    closeCart();
    if (!checkoutModal) return;

    // Update summary preview
    const checkoutSummaryEl = document.getElementById('checkout-items-summary');
    const checkoutTotalEl = document.getElementById('checkout-total-val');
    let subtotal = 0;
    let listHtml = cart
      .map((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `<li><span>${item.quantity}x ${item.title}</span><strong>$${itemTotal.toFixed(2)}</strong></li>`;
      })
      .join('');

    const promo = getActivePromo();
    const discount = promo && promo.code === 'BOBAHAPPY' ? subtotal * 0.20 : 0;
    const finalTotal = Math.max(0, subtotal - discount);

    if (checkoutSummaryEl) checkoutSummaryEl.innerHTML = listHtml;
    if (checkoutTotalEl) checkoutTotalEl.textContent = `$${finalTotal.toFixed(2)}`;

    // Reset view
    const formView = document.getElementById('checkout-form-view');
    const successView = document.getElementById('checkout-success-view');
    if (formView) formView.style.display = 'block';
    if (successView) successView.style.display = 'none';

    checkoutModal.classList.add('is-open');
    checkoutModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckoutModal() {
    if (!checkoutModal) return;
    checkoutModal.classList.remove('is-open');
    checkoutModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function handleOrderSubmit(e) {
    if (e) e.preventDefault();
    const formView = document.getElementById('checkout-form-view');
    const successView = document.getElementById('checkout-success-view');
    const orderNumEl = document.getElementById('order-confirmation-num');

    const randomOrderNum = Math.floor(1000 + Math.random() * 9000);
    if (orderNumEl) orderNumEl.textContent = `#BB-${randomOrderNum}`;

    if (formView) formView.style.display = 'none';
    if (successView) successView.style.display = 'block';

    // Clear cart after successful simulated order
    saveCart([]);
    saveActivePromo(null);
    showToast(`Order #BB-${randomOrderNum} placed successfully!`, 'bi-cup-straw');
  }

  // 8. Category Filter for Catalog
  function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-filter-btn');
    const productCards = document.querySelectorAll('.boba-product-card');

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.getAttribute('data-filter') || 'all';

        productCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category') || '';
          if (filterVal === 'all' || cardCat.includes(filterVal)) {
            card.style.display = 'flex';
            card.classList.add('animate-fade-in');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 9. Initialize Event Listeners
  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    initCategoryFilters();

    // Open Cart buttons (navbar + floating button)
    document.querySelectorAll('.boba-cart-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
      });
    });

    if (cartCloseBtn) {
      cartCloseBtn.addEventListener('click', closeCart);
    }

    if (cartBackdrop) {
      cartBackdrop.addEventListener('click', closeCart);
    }

    // Promo code apply
    if (promoApplyBtn && promoInput) {
      promoApplyBtn.addEventListener('click', () => {
        applyPromo(promoInput.value);
      });
      promoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyPromo(promoInput.value);
        }
      });
    }

    // Quick add to cart buttons on cards
    document.querySelectorAll('.boba-quick-add').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.boba-product-card');
        if (!card) return;
        const title = card.querySelector('.product-title')?.textContent || 'Boba Drink';
        const priceText = card.querySelector('.product-price')?.textContent || '$5.75';
        const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 5.75;
        const img = card.querySelector('img')?.getAttribute('src') || 'assets/images/home/signature-strawberry.webp';
        const defaultOptions = card.getAttribute('data-default-options') || 'Large · 50% Sweet · Less Ice · Pearls';

        addToCart({
          id: `card-${Date.now()}`,
          title: title.trim(),
          image: img,
          price: price,
          quantity: 1,
          options: defaultOptions
        });
      });
    });

    // Customizer triggers
    document.querySelectorAll('.boba-customize-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productKey = btn.getAttribute('data-product-key') || 'strawberry-cloud';
        openCustomizeModal(productKey);
      });
    });

    // Customizer form changes
    const customForm = document.getElementById('custom-drink-form');
    if (customForm) {
      customForm.addEventListener('change', updateCustomModalPrice);
      customForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitCustomDrink();
      });
    }

    const customCloseBtn = document.getElementById('custom-modal-close');
    if (customCloseBtn) customCloseBtn.addEventListener('click', closeCustomizeModal);
    if (customizeModal) {
      customizeModal.addEventListener('click', (e) => {
        if (e.target === customizeModal) closeCustomizeModal();
      });
    }

    // Checkout modal triggers
    const checkoutTriggerBtn = document.getElementById('cart-checkout-btn');
    if (checkoutTriggerBtn) {
      checkoutTriggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCheckoutModal();
      });
    }

    const checkoutCloseBtn = document.getElementById('checkout-modal-close');
    if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckoutModal);

    const checkoutForm = document.getElementById('checkout-order-form');
    if (checkoutForm) checkoutForm.addEventListener('submit', handleOrderSubmit);

    // Copy coupon buttons
    document.querySelectorAll('.copy-coupon-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-code') || 'BOBAHAPPY';
        navigator.clipboard.writeText(code).then(() => {
          showToast(`Copied code "${code}"! 20% discount ready at checkout.`, 'bi-clipboard-check');
        }).catch(() => {
          showToast(`Coupon code is: ${code}`, 'bi-tag-fill');
        });
      });
    });

    // Keyboard escape listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (cartDrawer && cartDrawer.classList.contains('is-open')) closeCart();
        if (customizeModal && customizeModal.classList.contains('is-open')) closeCustomizeModal();
        if (checkoutModal && checkoutModal.classList.contains('is-open')) closeCheckoutModal();
      }
    });
  });

  // Expose global controller
  window.BobaCart = {
    openCart,
    closeCart,
    addToCart,
    changeQty,
    removeItem,
    applyPromo,
    removePromo,
    openCustomizeModal,
    closeCustomizeModal,
    openCheckoutModal,
    closeCheckoutModal
  };
})();
