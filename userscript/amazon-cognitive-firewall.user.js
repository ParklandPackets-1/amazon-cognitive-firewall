// ==UserScript==
// @name Amazon Cognitive Firewall (CA + US)
// @namespace    local.cognitive.firewall.amazon
// @version      0.3.1
// @description Reduce Amazon clutter and recommendation pressure. Local-only. Checkout-safe.
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.com/*
// @exclude      https://www.amazon.ca/ap/*
// @exclude      https://www.amazon.com/ap/*
// @exclude      https://www.amazon.ca/gp/your-account/*
// @exclude      https://www.amazon.com/gp/your-account/*
// @exclude      https://www.amazon.ca/gp/buy/*
// @exclude      https://www.amazon.com/gp/buy/*
// @exclude      https://www.amazon.ca/gp/cart/*
// @exclude      https://www.amazon.com/gp/cart/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  /**
   * Amazon Cognitive Firewall — v0.3.1
   *
   * NON-GOALS (enforced by design):
   * - No network calls / telemetry
   * - No affiliate links
   * - No auto-buy / automation
   * - No price scraping
   * - No credentials / account data handling
   */

  const CONFIG = {
    // KILL SWITCH:
    // Set enabled=false to instantly disable without uninstalling.
    enabled: true,

    // Change to 'minimal' for a more aggressive, low-distraction experience
    mode: 'balanced', // 'balanced' | 'minimal'

    // Safety: avoid touching cart/checkout flows in v0.x
    avoidCheckout: true,

    // Dev only: keep false for normal use
    debug: false
  };

  if (!CONFIG.enabled) return;

  const host = location.hostname;
  const path = location.pathname || '';
  const url = new URL(location.href);

  // Belt + suspenders: never touch checkout/cart flows.
  if (CONFIG.avoidCheckout) {
    const checkoutLike =
      path.startsWith('/gp/buy') ||
      path.startsWith('/checkout') ||
      path.includes('/payments') ||
      path.startsWith('/gp/cart/');
    if (checkoutLike) return;
  }

  // Page context (intent-aware behavior)
  const PAGE = {
    isHome: path === '/' || path === '/ref=nav_logo',
    isSearch: path.startsWith('/s') || url.searchParams.has('k'),
    isProduct: /\/dp\/|\/gp\/product\//.test(path)
  };

  // Shared “noise surfaces”
  const COMMON_HIDE = [
    // Sponsored / promoted labels/blocks (varies by layout)
    '[data-component-type="sponsored"]',
    '.s-sponsored-label-text',
    '[aria-label="Sponsored"]',

    // Personalization widgets / rails
    '[cel_widget_id^="p13n"]',
    '[id^="desktop-rhf"]',

    // Browsing history / keep shopping modules
    '#nav-flyout-history',

    // Interest-based ads notice (sometimes huge on search)
    '[data-component-type="interest-based-ad-notice"]',
    'div[id*="interestBasedAds"]',
    'div[class*="interestBasedAds"]'
  ];

  // Product-page pressure points
  const PRODUCT_HIDE_BALANCED = [
    // High-pressure upsells
    '#purchase-sims-feature',
    '#session-sims-feature',

    // Common similarity containers (legacy / variant IDs)
    '#desktop-dp-sims_purchase-similarities',
    '#desktop-dp-sims_session-similarities',
    '#sims-consolidated-2_feature_div',
    '#sp_detail'
  ];

  // Search-page clutter
  const SEARCH_HIDE_BALANCED = [
    // Right-side rail (common on desktop)
    '#s-right-side-bar'
  ];

  // Minimal mode adds more aggressive removals (kept intentionally small)
  const MINIMAL_EXTRA = [
    '#navFooter'
    // We are intentionally NOT removing “similar product videos” by default.
    // If you later decide minimal should remove them, we’ll add that selector here.
  ];

  function selectorsToHide() {
    const list = [...COMMON_HIDE];

    if (PAGE.isProduct) list.push(...PRODUCT_HIDE_BALANCED);
    if (PAGE.isSearch) list.push(...SEARCH_HIDE_BALANCED);

    if (CONFIG.mode === 'minimal') list.push(...MINIMAL_EXTRA);

    return list;
  }

  function apply() {
    const sels = selectorsToHide();

    for (const sel of sels) {
      document.querySelectorAll(sel).forEach(el => {
        if (!el) return;

        // Never hide core structural nodes
        const tag = (el.tagName || '').toLowerCase();
        if (tag === 'html' || tag === 'body' || tag === 'main') return;

        el.style.display = 'none';
      });
    }
  }

  // Initial run
  apply();

  // Re-apply a few times after load (Safari + Amazon dynamic injection)
  let tries = 0;
  const interval = setInterval(() => {
    apply();
    tries += 1;
    if (tries >= 10) clearInterval(interval); // ~5 seconds total
  }, 500);

  // Also re-apply on DOM mutations
  const observer = new MutationObserver(() => apply());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (CONFIG.debug) {
    console.log('[Cognitive Firewall]', {
      version: '0.3.1',
      host,
      path,
      mode: CONFIG.mode,
      page: PAGE
    });
  }
})();
