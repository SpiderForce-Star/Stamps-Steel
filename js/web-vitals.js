/**
 * Stamps Steel — Core Web Vitals collector (LCP, CLS, INP, FCP, TTFB)
 * - Silent by default (dataLayer + window.__SSB_VITALS__)
 * - Optional overlay: add ?vitals=1 to any page URL
 * Thresholds match Google's Core Web Vitals guidance (good / needs improvement / poor)
 */
(function () {
  'use strict';

  if (window.__SSB_VITALS_INIT__) return;
  window.__SSB_VITALS_INIT__ = true;

  var THRESHOLDS = {
    LCP: { good: 2500, ni: 4000, unit: 'ms' },
    CLS: { good: 0.1, ni: 0.25, unit: '' },
    INP: { good: 200, ni: 500, unit: 'ms' },
    FCP: { good: 1800, ni: 3000, unit: 'ms' },
    TTFB: { good: 800, ni: 1800, unit: 'ms' }
  };

  var state = {
    LCP: null,
    CLS: null,
    INP: null,
    FCP: null,
    TTFB: null,
    lcpElement: null,
    navigationType: '',
    path: location.pathname + location.search
  };

  window.__SSB_VITALS__ = state;

  function rating(name, value) {
    var t = THRESHOLDS[name];
    if (!t || value == null || isNaN(value)) return 'unknown';
    if (value <= t.good) return 'good';
    if (value <= t.ni) return 'needs-improvement';
    return 'poor';
  }

  function round(name, value) {
    if (value == null || isNaN(value)) return null;
    if (name === 'CLS') return Math.round(value * 1000) / 1000;
    return Math.round(value);
  }

  function pushDataLayer(metric) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'core_web_vital',
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_id: metric.id || '',
        page_path: state.path
      });
    } catch (e) { /* no-op */ }
  }

  function report(name, value, extra) {
    var v = round(name, value);
    if (v == null) return;
    state[name] = v;
    if (extra && extra.element) state.lcpElement = extra.element;
    var payload = {
      name: name,
      value: v,
      rating: rating(name, name === 'CLS' ? value : v),
      id: (extra && extra.id) || '',
      navigationType: state.navigationType
    };
    pushDataLayer(payload);
    if (window.__SSB_VITALS_DEBUG__) {
      try {
        console.info('[SSB Web Vitals]', payload.name, payload.value, payload.rating, payload);
      } catch (e) { /* no-op */ }
    }
    if (overlayApi) overlayApi.update();
  }

  function onLCP() {
    if (!('PerformanceObserver' in window)) return;
    var last = null;
    try {
      var po = new PerformanceObserver(function (list) {
        var entries = list.getEntries();
        if (!entries.length) return;
        last = entries[entries.length - 1];
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });
      var finalize = function () {
        if (!last) return;
        var el = last.element;
        var label = '';
        if (el) {
          label = (el.tagName || '') + (el.id ? '#' + el.id : '') +
            (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
        }
        report('LCP', last.startTime, { element: label || null, id: last.id || '' });
        try { po.disconnect(); } catch (e) { /* no-op */ }
      };
      // LCP finalizes on page hide / first interaction
      ['visibilitychange', 'pagehide', 'keydown', 'pointerdown'].forEach(function (evt) {
        addEventListener(evt, function once() {
          if (evt === 'visibilitychange' && document.visibilityState !== 'hidden') return;
          finalize();
        }, { once: true, capture: true, passive: true });
      });
      // Also snapshot after load + short delay for lab-like readout
      addEventListener('load', function () {
        setTimeout(finalize, 3000);
      });
    } catch (e) { /* unsupported */ }
  }

  function onFCP() {
    if (!('PerformanceObserver' in window)) return;
    try {
      var po = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
          if (entry.name === 'first-contentful-paint') {
            report('FCP', entry.startTime);
            try { po.disconnect(); } catch (e) { /* no-op */ }
          }
        });
      });
      po.observe({ type: 'paint', buffered: true });
    } catch (e) { /* unsupported */ }
  }

  function onCLS() {
    if (!('PerformanceObserver' in window)) return;
    var cls = 0;
    var sessionValue = 0;
    var sessionEntries = [];
    try {
      var po = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
          if (entry.hadRecentInput) return;
          var first = sessionEntries[0];
          var last = sessionEntries[sessionEntries.length - 1];
          if (sessionValue && entry.startTime - last.startTime < 1000 && entry.startTime - first.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }
          if (sessionValue > cls) {
            cls = sessionValue;
            report('CLS', cls);
          }
        });
      });
      po.observe({ type: 'layout-shift', buffered: true });
    } catch (e) { /* unsupported */ }
  }

  function onINP() {
    if (!('PerformanceObserver' in window)) return;
    var maxDuration = 0;
    try {
      var po = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
          // Prefer interactionId grouping when present
          var d = entry.duration;
          if (d > maxDuration) {
            maxDuration = d;
            report('INP', maxDuration);
          }
        });
      });
      po.observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch (e) {
      // Fallback: first-input delay approx
      try {
        var po2 = new PerformanceObserver(function (list) {
          var entry = list.getEntries()[0];
          if (entry) report('INP', entry.processingStart - entry.startTime);
        });
        po2.observe({ type: 'first-input', buffered: true });
      } catch (e2) { /* unsupported */ }
    }
  }

  function onTTFB() {
    try {
      var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (nav) {
        state.navigationType = nav.type || '';
        report('TTFB', nav.responseStart);
      }
    } catch (e) { /* no-op */ }
  }

  /* ---------- Optional overlay (?vitals=1) — hidden for normal visitors ---------- */
  var overlayApi = null;

  function shouldShowOverlay() {
    try {
      var q = new URLSearchParams(location.search);
      if (q.get('vitals') === '1' || q.get('vitals') === 'true') return true;
      if (localStorage.getItem('ssb_vitals_overlay') === '1') return true;
    } catch (e) { /* no-op */ }
    return false;
  }

  function mountOverlay() {
    if (document.getElementById('ssb-vitals-overlay')) return;
    var root = document.createElement('div');
    root.id = 'ssb-vitals-overlay';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Core Web Vitals metrics');
    root.innerHTML =
      '<style>' +
      '#ssb-vitals-overlay{all:initial;position:fixed;z-index:2147483000;right:12px;bottom:12px;max-width:min(360px,calc(100vw - 24px));font-family:Inter,system-ui,sans-serif;font-size:12px;line-height:1.35;color:#0f172a;}' +
      '#ssb-vitals-overlay *{box-sizing:border-box;font-family:inherit;}' +
      '#ssb-vitals-overlay .card{background:rgba(255,255,255,.96);border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 12px 40px rgba(15,23,42,.16);padding:12px 12px 10px;backdrop-filter:blur(8px);}' +
      '#ssb-vitals-overlay .head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;}' +
      '#ssb-vitals-overlay .title{font-weight:800;font-size:12px;letter-spacing:.02em;text-transform:uppercase;color:#0f172a;}' +
      '#ssb-vitals-overlay .sub{color:#64748b;font-size:11px;margin-top:2px;}' +
      '#ssb-vitals-overlay button{all:unset;cursor:pointer;color:#64748b;font-weight:700;padding:4px 6px;border-radius:8px;}' +
      '#ssb-vitals-overlay button:hover{background:#f1f5f9;color:#0f172a;}' +
      '#ssb-vitals-overlay table{width:100%;border-collapse:collapse;}' +
      '#ssb-vitals-overlay td{padding:5px 0;vertical-align:middle;}' +
      '#ssb-vitals-overlay td.k{font-weight:700;color:#334155;width:42px;}' +
      '#ssb-vitals-overlay td.v{font-variant-numeric:tabular-nums;font-weight:700;text-align:right;padding-right:8px;}' +
      '#ssb-vitals-overlay td.r{text-align:right;}' +
      '#ssb-vitals-overlay .pill{display:inline-block;padding:2px 7px;border-radius:999px;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.03em;}' +
      '#ssb-vitals-overlay .good{background:#dcfce7;color:#166534;}' +
      '#ssb-vitals-overlay .needs-improvement{background:#fef3c7;color:#92400e;}' +
      '#ssb-vitals-overlay .poor{background:#fee2e2;color:#991b1b;}' +
      '#ssb-vitals-overlay .unknown{background:#f1f5f9;color:#64748b;}' +
      '#ssb-vitals-overlay .foot{margin-top:8px;color:#94a3b8;font-size:10px;}' +
      '#ssb-vitals-overlay .el{margin-top:4px;color:#64748b;font-size:10px;word-break:break-all;}' +
      '@media (max-width:390px){#ssb-vitals-overlay{right:8px;bottom:8px;left:8px;max-width:none;}}' +
      '</style>' +
      '<div class="card">' +
      '<div class="head"><div><div class="title">Core Web Vitals</div><div class="sub">Lab snapshot · Stamps Steel</div></div>' +
      '<div><button type="button" id="ssb-vitals-copy" title="Copy JSON">Copy</button> <button type="button" id="ssb-vitals-close" title="Hide panel" aria-label="Close">✕</button></div></div>' +
      '<table aria-live="polite">' +
      '<tr><td class="k">LCP</td><td class="v" data-m="LCP">—</td><td class="r"><span class="pill unknown" data-r="LCP">…</span></td></tr>' +
      '<tr><td class="k">CLS</td><td class="v" data-m="CLS">—</td><td class="r"><span class="pill unknown" data-r="CLS">…</span></td></tr>' +
      '<tr><td class="k">INP</td><td class="v" data-m="INP">—</td><td class="r"><span class="pill unknown" data-r="INP">…</span></td></tr>' +
      '<tr><td class="k">FCP</td><td class="v" data-m="FCP">—</td><td class="r"><span class="pill unknown" data-r="FCP">…</span></td></tr>' +
      '<tr><td class="k">TTFB</td><td class="v" data-m="TTFB">—</td><td class="r"><span class="pill unknown" data-r="TTFB">…</span></td></tr>' +
      '</table>' +
      '<div class="el" data-lcp-el></div>' +
      '<div class="foot">Good LCP ≤ 2.5s · Hidden for visitors unless ?vitals=1</div>' +
      '</div>';
    document.documentElement.appendChild(root);

    document.getElementById('ssb-vitals-close').addEventListener('click', function () {
      try { localStorage.removeItem('ssb_vitals_overlay'); } catch (e) { /* no-op */ }
      root.remove();
      overlayApi = null;
    });
    document.getElementById('ssb-vitals-copy').addEventListener('click', function () {
      var json = JSON.stringify(state, null, 2);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json).catch(function () {});
      }
    });

    function fmt(name, v) {
      if (v == null) return '—';
      if (name === 'CLS') return String(v);
      if (v >= 1000 && name !== 'CLS') return (v / 1000).toFixed(2) + ' s';
      return v + ' ms';
    }

    overlayApi = {
      update: function () {
        ['LCP', 'CLS', 'INP', 'FCP', 'TTFB'].forEach(function (name) {
          var v = state[name];
          var cell = root.querySelector('[data-m="' + name + '"]');
          var pill = root.querySelector('[data-r="' + name + '"]');
          if (cell) cell.textContent = fmt(name, v);
          if (pill) {
            var r = v == null ? 'unknown' : rating(name, name === 'CLS' ? v : v);
            pill.className = 'pill ' + r;
            pill.textContent = r === 'needs-improvement' ? 'NI' : r === 'unknown' ? '…' : r;
          }
        });
        var el = root.querySelector('[data-lcp-el]');
        if (el) el.textContent = state.lcpElement ? ('LCP element: ' + state.lcpElement) : '';
      }
    };
    overlayApi.update();
  }

  // Enable debug logging with ?vitals=1
  try {
    var params = new URLSearchParams(location.search);
    if (params.get('vitals') === '1' || params.get('vitals') === 'true') {
      window.__SSB_VITALS_DEBUG__ = true;
      try { localStorage.setItem('ssb_vitals_overlay', '1'); } catch (e) { /* no-op */ }
    }
  } catch (e) { /* no-op */ }

  onTTFB();
  onFCP();
  onLCP();
  onCLS();
  onINP();

  if (shouldShowOverlay()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountOverlay);
    } else {
      mountOverlay();
    }
  }
})();
