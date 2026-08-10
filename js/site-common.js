/**
 * Shared chrome: mobile sticky CTA, optional mobile menu helper.
 */
(function () {
  'use strict';

  function ensureSticky() {
    if (document.querySelector('.stamps-sticky-cta')) {
      document.body.classList.add('has-sticky-cta');
      return;
    }
    var bar = document.createElement('div');
    bar.className = 'stamps-sticky-cta';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Quick contact');
    var quoteHref = document.getElementById('contact')
      ? '#contact'
      : (document.querySelector('[data-stamps-quote]') ? '#' + (document.querySelector('[data-stamps-quote]').closest('section') || {}).id || 'index.html#contact' : 'index.html#contact');
    if (!document.getElementById('contact') && !document.querySelector('#quote')) {
      quoteHref = 'index.html#contact';
    } else if (document.getElementById('contact')) {
      quoteHref = '#contact';
    } else if (document.getElementById('quote')) {
      quoteHref = '#quote';
    }
    bar.innerHTML =
      '<a class="sq-call" href="tel:+16156298217">Call (615) 629-8217</a>' +
      '<a class="sq-quote" href="' + quoteHref + '">Get Free Quote</a>';
    document.body.appendChild(bar);
    document.body.classList.add('has-sticky-cta');
  }

  function mobileMenu() {
    var btn = document.getElementById('menu-btn');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu || btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function init() {
    ensureSticky();
    mobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
