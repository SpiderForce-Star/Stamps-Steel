/**
 * Ballpark PEB size estimator — guidance only, no prices.
 */
(function () {
  'use strict';

  function build(root) {
    root.classList.add('stamps-estimator');
    root.innerHTML =
      '<h3>Quick size estimator</h3>' +
      '<p class="se-sub">Get square footage and planning guidance — then request a free engineered quote. Not a price quote.</p>' +
      '<div class="se-grid">' +
        '<div><label for="se-w">Width (ft)</label><input id="se-w" type="number" min="12" max="400" value="40"></div>' +
        '<div><label for="se-l">Length (ft)</label><input id="se-l" type="number" min="20" max="600" value="60"></div>' +
        '<div><label for="se-h">Eave height (ft)</label><input id="se-h" type="number" min="8" max="40" value="14"></div>' +
      '</div>' +
      '<div class="se-grid">' +
        '<div><label for="se-type">Building type</label>' +
        '<select id="se-type">' +
          '<option>Shop / Garage</option><option>Commercial</option><option>Agricultural</option>' +
          '<option>Warehouse</option><option>Mini-Storage</option><option>Barndominium</option><option>Other</option>' +
        '</select></div>' +
        '<div><label for="se-doors">Large overhead doors (approx.)</label>' +
        '<input id="se-doors" type="number" min="0" max="20" value="2"></div>' +
        '<div></div>' +
      '</div>' +
      '<div class="se-result" aria-live="polite">' +
        '<div class="se-sqft" data-sqft>—</div>' +
        '<p data-note>Enter dimensions to estimate footprint.</p>' +
      '</div>' +
      '<div class="se-actions">' +
        '<a class="se-cta-primary" href="#contact" data-to-quote>Continue to free quote</a>' +
        '<a class="se-cta-secondary" href="designer.html">Open 3D designer</a>' +
      '</div>';

    var wEl = root.querySelector('#se-w');
    var lEl = root.querySelector('#se-l');
    var hEl = root.querySelector('#se-h');
    var typeEl = root.querySelector('#se-type');
    var doorsEl = root.querySelector('#se-doors');
    var sqftEl = root.querySelector('[data-sqft]');
    var noteEl = root.querySelector('[data-note]');
    var quoteLink = root.querySelector('[data-to-quote]');

    function update() {
      var w = Number(wEl.value) || 0;
      var l = Number(lEl.value) || 0;
      var h = Number(hEl.value) || 0;
      var doors = Number(doorsEl.value) || 0;
      var type = typeEl.value;
      if (w < 10 || l < 10) {
        sqftEl.textContent = '—';
        noteEl.textContent = 'Enter width and length to estimate footprint.';
        return;
      }
      var sqft = Math.round(w * l);
      sqftEl.textContent = sqft.toLocaleString() + ' sq ft footprint';
      var notes = [];
      notes.push(w + '′ × ' + l + '′' + (h ? ' × ' + h + '′ eave' : '') + ' · ' + type + '.');
      if (doors > 0) {
        notes.push('Plan for ' + doors + ' large framed opening' + (doors > 1 ? 's' : '') + ' (headers/jambs sized with the PEB).');
      }
      if (type === 'Warehouse' || type === 'Commercial') {
        notes.push('Commercial and warehouse shells often pair higher eaves with insulation or IMP packages.');
      } else if (type === 'Agricultural') {
        notes.push('Ag buildings frequently use open or partially open bays — tell us livestock vs equipment use.');
      } else if (type === 'Mini-Storage') {
        notes.push('Mini storage uses continuous roof and partition packages — see Mini Storage for system notes.');
      } else {
        notes.push('This is planning guidance only. Site wind/snow, soil, and codes drive the engineered package.');
      }
      notes.push('Next: free quote or configure doors and layout in the 3D designer.');
      noteEl.textContent = notes.join(' ');

      // Prefill quote step via sessionStorage for optional handoff
      try {
        sessionStorage.setItem(
          'stamps_estimator',
          JSON.stringify({ width: w, length: l, height: h, type: type, doors: doors, sqft: sqft })
        );
      } catch (e) { /* ignore */ }
    }

    [wEl, lEl, hEl, typeEl, doorsEl].forEach(function (el) {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });
    quoteLink.addEventListener('click', function () {
      // Prefer on-page contact; else index
      if (!document.getElementById('contact') && !document.querySelector('[data-stamps-quote]')) {
        quoteLink.setAttribute('href', 'index.html#contact');
      }
    });
    update();
  }

  function init() {
    document.querySelectorAll('[data-stamps-estimator]').forEach(build);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
