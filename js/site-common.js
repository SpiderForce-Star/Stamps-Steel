/**
 * Stamps Steel — shared chrome
 * - Mobile sticky bottom CTA (Call + Free Quote)
 * - Mobile menu helper
 *
 * Sticky bar: mobile-only, appears after short scroll, optional session dismiss.
 */
(function () {
  'use strict';

  var SCROLL_SHOW_PX = 180;
  var DISMISS_KEY = 'stamps_sticky_cta_dismissed';

  function resolveQuoteHref() {
    if (document.getElementById('contact')) return '#contact';
    if (document.getElementById('quote')) return '#quote';
    var mount = document.querySelector('[data-stamps-quote]');
    if (mount) {
      var sec = mount.closest('section[id]');
      if (sec && sec.id) return '#' + sec.id;
    }
    // Relative path-safe home quote
    var path = (window.location.pathname || '').toLowerCase();
    if (path.endsWith('index.html') || path.endsWith('/') || path.indexOf('stamps-steel') >= 0 && path.split('/').pop() === '') {
      return '#contact';
    }
    return 'index.html#contact';
  }

  function ensureSticky() {
    if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
    if (document.querySelector('.stamps-sticky-cta')) {
      bindStickyBehavior(document.querySelector('.stamps-sticky-cta'));
      return;
    }

    var quoteHref = resolveQuoteHref();
    var bar = document.createElement('div');
    bar.className = 'stamps-sticky-cta';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Quick contact actions');
    bar.innerHTML =
      '<div class="stamps-sticky-inner">' +
        '<a class="stamps-sticky-btn stamps-sticky-call" href="tel:+16156298217" aria-label="Call Stamps Steel at 615-629-8217">' +
          '<span class="stamps-sticky-icon" aria-hidden="true">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
          '</span>' +
          '<span class="stamps-sticky-label">' +
            '<span class="stamps-sticky-label-full">Call (615) 629-8217</span>' +
            '<span class="stamps-sticky-label-short">Call Now</span>' +
          '</span>' +
        '</a>' +
        '<a class="stamps-sticky-btn stamps-sticky-quote" href="' + quoteHref + '" aria-label="Get a free quote">' +
          '<span class="stamps-sticky-icon" aria-hidden="true">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' +
          '</span>' +
          '<span>Get a Quote</span>' +
        '</a>' +
        '<button type="button" class="stamps-sticky-dismiss" aria-label="Dismiss contact bar" title="Dismiss">' +
          '<span aria-hidden="true">×</span>' +
        '</button>' +
      '</div>';

    document.body.appendChild(bar);
    bindStickyBehavior(bar);
  }

  function bindStickyBehavior(bar) {
    if (bar.dataset.bound === '1') return;
    bar.dataset.bound = '1';

    var dismissBtn = bar.querySelector('.stamps-sticky-dismiss');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', function () {
        try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (e) { /* ignore */ }
        bar.classList.remove('is-visible');
        document.body.classList.remove('has-sticky-cta');
        // remove after transition
        window.setTimeout(function () {
          if (bar.parentNode) bar.parentNode.removeChild(bar);
        }, 280);
      });
    }

    // Smooth scroll for in-page quote anchors
    var quoteBtn = bar.querySelector('.stamps-sticky-quote');
    if (quoteBtn) {
      quoteBtn.addEventListener('click', function (e) {
        var href = quoteBtn.getAttribute('href') || '';
        if (href.charAt(0) === '#') {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            try { history.pushState(null, '', href); } catch (err) { /* ignore */ }
          }
        }
      });
    }

    function onScroll() {
      // md and up: never show
      if (window.matchMedia('(min-width: 768px)').matches) {
        bar.classList.remove('is-visible');
        document.body.classList.remove('has-sticky-cta');
        return;
      }
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      var show = y > SCROLL_SHOW_PX;
      bar.classList.toggle('is-visible', show);
      document.body.classList.toggle('has-sticky-cta', show);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('orientationchange', function () {
      window.setTimeout(onScroll, 100);
    });
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

  var BLDG_POP = {
    shops: {
      title: 'Shops',
      hook: 'Clear-span workshops and garages with overhead doors and an open floor.',
      href: 'index.html#bt-residential',
      img: 'images/building-types/garage-ext.webp',
      alt: 'Metal shop building with overhead doors'
    },
    churches: {
      title: 'Churches',
      hook: 'Clear-span gathering buildings sized for worship, fellowship, and growth.',
      href: 'churches.html',
      img: 'images/building-types/garage-int.webp',
      alt: 'Clear-span steel interior suitable for a gathering hall'
    },
    storage: {
      title: 'Storage',
      hook: 'Mini-storage rows and multi-unit buildings built for durable, low-maintenance use.',
      href: 'mini-storage.html',
      img: 'images/building-types/mini-ext.webp',
      alt: 'Mini storage metal building with roll-up doors'
    },
    ag: {
      title: 'Ag',
      hook: 'Barns and farm buildings with clear span for equipment, livestock, and hay.',
      href: 'index.html#bt-ag',
      img: 'images/building-types/ag-ext.webp',
      alt: 'Agricultural metal barn exterior'
    },
    warehouses: {
      title: 'Warehouses',
      hook: 'Clear-span warehouses and shops for inventory, docks, and future expansion.',
      href: 'index.html#bt-industrial',
      img: 'images/building-types/warehouse-ext.webp',
      alt: 'Commercial warehouse metal building'
    }
  };

  function buildingPopovers() {
    var links = document.querySelectorAll('.nav-desktop [data-bldg]');
    if (!links.length) return;

    var pop = document.getElementById('bldg-pop');
    if (!pop) {
      pop = document.createElement('div');
      pop.id = 'bldg-pop';
      pop.className = 'bldg-pop';
      pop.setAttribute('role', 'tooltip');
      pop.innerHTML =
        '<img alt="">' +
        '<div class="bldg-pop-body">' +
          '<p class="bldg-pop-title"></p>' +
          '<p class="bldg-pop-hook"></p>' +
          '<a class="bldg-pop-cta" href="#">Get a quote</a>' +
        '</div>';
      document.body.appendChild(pop);
    }

    var hideTimer = null;
    var img = pop.querySelector('img');
    var title = pop.querySelector('.bldg-pop-title');
    var hook = pop.querySelector('.bldg-pop-hook');
    var cta = pop.querySelector('.bldg-pop-cta');

    function hide() {
      pop.classList.remove('is-open');
    }
    function scheduleHide() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hide, 160);
    }
    function show(link) {
      var key = link.getAttribute('data-bldg');
      var data = BLDG_POP[key];
      if (!data) return;
      clearTimeout(hideTimer);
      img.src = data.img;
      img.alt = data.alt;
      title.textContent = data.title;
      hook.textContent = data.hook;
      cta.href = data.href;
      cta.textContent = 'See ' + data.title;
      pop.classList.add('is-open');
      var r = link.getBoundingClientRect();
      var w = pop.offsetWidth || 300;
      var left = Math.min(window.innerWidth - w - 12, Math.max(12, r.left + r.width / 2 - w / 2));
      var top = r.bottom + 10;
      pop.style.left = left + 'px';
      pop.style.top = top + 'px';
    }

    links.forEach(function (link) {
      link.addEventListener('mouseenter', function () { show(link); });
      link.addEventListener('focus', function () { show(link); });
      link.addEventListener('mouseleave', scheduleHide);
      link.addEventListener('blur', scheduleHide);
    });
    pop.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    pop.addEventListener('mouseleave', scheduleHide);
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('resize', hide, { passive: true });
  }

  function navDropdown() {
    var drops = document.querySelectorAll('.nav-drop');
    if (!drops.length) return;

    function closeAll(except) {
      drops.forEach(function (drop) {
        if (drop === except) return;
        drop.classList.remove('is-open');
        var btn = drop.querySelector('.nav-drop-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }

    drops.forEach(function (drop) {
      var btn = drop.querySelector('.nav-drop-btn');
      if (!btn || btn.dataset.bound) return;
      btn.dataset.bound = '1';

      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = !drop.classList.contains('is-open');
        closeAll(open ? drop : null);
        drop.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      drop.addEventListener('mouseleave', function () {
        drop.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('.nav-drop')) return;
      closeAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  function init() {
    ensureSticky();
    mobileMenu();
    navDropdown();
    buildingPopovers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
