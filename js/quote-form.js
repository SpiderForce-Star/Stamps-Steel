/**
 * Stamps Steel multi-step quote form → Formspree
 * SETUP: Replace FORMSPREE_ENDPOINT with your form ID from https://formspree.io
 * Example: https://formspree.io/f/xxxxxxxx
 */
(function () {
  'use strict';

  // TODO: Replace with your real Formspree endpoint after signing up at formspree.io
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  var BUILDING_TYPES = [
    'Shop / Garage',
    'Church',
    'Commercial',
    'Agricultural',
    'Warehouse',
    'Mini-Storage',
    'Barndominium',
    'Aircraft Hangar',
    'Other'
  ];

  var TIMELINES = [
    'ASAP / under 3 months',
    '3–6 months',
    '6–12 months',
    '12+ months / planning',
    'Not sure yet'
  ];

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  function fieldError(input, msg) {
    var wrap = input.closest('.sq-field') || input.parentElement;
    var err = wrap.querySelector('.sq-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'sq-error';
      wrap.appendChild(err);
    }
    if (msg) {
      input.classList.add('is-invalid');
      err.textContent = msg;
      err.classList.add('is-visible');
      return false;
    }
    input.classList.remove('is-invalid');
    err.textContent = '';
    err.classList.remove('is-visible');
    return true;
  }

  function buildForm(root) {
    var context = root.getAttribute('data-context') || 'website';
    var title = root.getAttribute('data-title') || 'Request a free quote';
    var uid = 'sq-' + Math.random().toString(36).slice(2, 9);

    var preferred = '';
    if ((context || '').toLowerCase().indexOf('church') !== -1) preferred = 'Church';
    else if ((context || '').toLowerCase().indexOf('mini') !== -1) preferred = 'Mini-Storage';
    var typeOpts = BUILDING_TYPES.map(function (t) {
      var sel = (t === preferred) ? ' selected' : '';
      return '<option value="' + t + '"' + sel + '>' + t + '</option>';
    }).join('');
    var timeOpts = TIMELINES.map(function (t) {
      return '<option value="' + t + '">' + t + '</option>';
    }).join('');

    var shell = el(
      '<div class="stamps-quote" role="form" aria-label="Request a free quote">' +
        (title ? '<p class="sq-step-label" style="margin-bottom:0.75rem"><strong>' + title + '</strong></p>' : '') +
        '<div class="sq-steps" aria-hidden="true">' +
          '<div class="sq-step-dot is-active" data-dot="0"></div>' +
          '<div class="sq-step-dot" data-dot="1"></div>' +
          '<div class="sq-step-dot" data-dot="2"></div>' +
        '</div>' +
        '<p class="sq-step-label"><span data-step-text>Step 1 of 3 — Contact</span></p>' +
        '<div class="sq-alert" role="alert" data-alert></div>' +
        '<form novalidate data-sq-form>' +
          '<input type="hidden" name="_subject" value="Stamps Steel quote request">' +
          '<input type="hidden" name="form_context" value="' + context + '">' +
          '<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">' +

          '<div class="sq-panel is-active" data-panel="0">' +
            '<div class="sq-grid-2">' +
              '<div class="sq-field"><label for="' + uid + '-name">Name <span class="req">*</span></label>' +
              '<input id="' + uid + '-name" name="name" type="text" required autocomplete="name" placeholder="Your full name"></div>' +
              '<div class="sq-field"><label for="' + uid + '-phone">Phone <span class="req">*</span></label>' +
              '<input id="' + uid + '-phone" name="phone" type="tel" required autocomplete="tel" placeholder="(615) 555-0123"></div>' +
            '</div>' +
            '<div class="sq-field"><label for="' + uid + '-email">Email <span class="req">*</span></label>' +
            '<input id="' + uid + '-email" name="email" type="email" required autocomplete="email" placeholder="you@email.com"></div>' +
            '<div class="sq-nav"><button type="button" class="sq-btn sq-btn-primary" data-next>Continue</button></div>' +
          '</div>' +

          '<div class="sq-panel" data-panel="1">' +
            '<div class="sq-field"><label for="' + uid + '-type">Building type <span class="req">*</span></label>' +
            '<select id="' + uid + '-type" name="building_type" required><option value="">Select type…</option>' + typeOpts + '</select></div>' +
            '<div class="sq-grid-2">' +
              '<div class="sq-field"><label for="' + uid + '-w">Width (ft) <span class="req">*</span></label>' +
              '<input id="' + uid + '-w" name="width_ft" type="number" min="10" max="500" required placeholder="e.g. 40"></div>' +
              '<div class="sq-field"><label for="' + uid + '-l">Length (ft) <span class="req">*</span></label>' +
              '<input id="' + uid + '-l" name="length_ft" type="number" min="10" max="800" required placeholder="e.g. 60"></div>' +
            '</div>' +
            '<div class="sq-field"><label for="' + uid + '-h">Eave height (ft) — wall to roof</label>' +
            '<input id="' + uid + '-h" name="eave_height_ft" type="number" min="8" max="60" placeholder="e.g. 14">' +
            '<p class="sq-hint">Eave height is the wall height up to the roof. Approximate is fine.</p></div>' +
            '<div class="sq-nav">' +
              '<button type="button" class="sq-btn sq-btn-secondary" data-back>Back</button>' +
              '<button type="button" class="sq-btn sq-btn-primary" data-next>Continue</button>' +
            '</div>' +
          '</div>' +

          '<div class="sq-panel" data-panel="2">' +
            '<div class="sq-field"><label for="' + uid + '-loc">Project location / ZIP or city <span class="req">*</span></label>' +
            '<input id="' + uid + '-loc" name="location" type="text" required placeholder="e.g. Gallatin, TN or 37066" autocomplete="address-level2"></div>' +
            '<div class="sq-field"><label for="' + uid + '-use">Intended use</label>' +
            '<input id="' + uid + '-use" name="intended_use" type="text" placeholder="Workshop, storage, auto service, farm equipment…"></div>' +
            '<div class="sq-field"><label for="' + uid + '-time">Timeline</label>' +
            '<select id="' + uid + '-time" name="timeline"><option value="">Select…</option>' + timeOpts + '</select></div>' +
            '<div class="sq-field"><label for="' + uid + '-msg">Message (optional)</label>' +
            '<textarea id="' + uid + '-msg" name="message" rows="3" placeholder="Doors, lean-tos, insulation needs, or notes from the 3D designer…"></textarea></div>' +
            '<div class="sq-field"><label for="' + uid + '-file">Photo or sketch (optional)</label>' +
            '<input id="' + uid + '-file" name="attachment" type="file" accept="image/*,.pdf">' +
            '<p class="sq-hint">Images or PDF up to ~5MB. Skip if you prefer email later.</p></div>' +
            '<div class="sq-nav">' +
              '<button type="button" class="sq-btn sq-btn-secondary" data-back>Back</button>' +
              '<button type="submit" class="sq-btn sq-btn-primary" data-submit>Send free quote request</button>' +
            '</div>' +
          '</div>' +
        '</form>' +
        '<div class="sq-success" data-success hidden>' +
          '<div class="sq-check" aria-hidden="true">✓</div>' +
          '<h3>Request received</h3>' +
          '<p>We’ll review your details and reply within <strong>one business day</strong>.</p>' +
          '<p style="font-size:0.875rem;color:#64748b">Need faster help? Call <a href="tel:+16156298217" style="color:#c97b3a;font-weight:700">(615) 629-8217</a></p>' +
          '<div class="sq-nav" style="justify-content:center">' +
            '<a class="sq-btn sq-btn-primary" href="designer.html" style="text-decoration:none">Explore 3D designer</a>' +
          '</div>' +
        '</div>' +
        '<p class="sq-footer-links">' +
          '<a href="mailto:info@stampssteel.com">info@stampssteel.com</a> · ' +
          '<a href="tel:+16156298217">(615) 629-8217</a>' +
        '</p>' +
      '</div>'
    );

    root.innerHTML = '';
    root.appendChild(shell);

    var form = shell.querySelector('[data-sq-form]');
    var panels = shell.querySelectorAll('[data-panel]');
    var dots = shell.querySelectorAll('[data-dot]');
    var stepText = shell.querySelector('[data-step-text]');
    var alertBox = shell.querySelector('[data-alert]');
    var success = shell.querySelector('[data-success]');
    var step = 0;
    var labels = [
      'Step 1 of 3 — Contact',
      'Step 2 of 3 — Building',
      'Step 3 of 3 — Project details'
    ];

    function showStep(n) {
      step = n;
      panels.forEach(function (p, i) {
        p.classList.toggle('is-active', i === n);
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === n);
        d.classList.toggle('is-done', i < n);
      });
      if (stepText) stepText.textContent = labels[n];
      alertBox.classList.remove('is-visible');
      alertBox.textContent = '';
    }

    function validateStep(n) {
      var ok = true;
      if (n === 0) {
        var name = form.elements.name;
        var phone = form.elements.phone;
        var email = form.elements.email;
        if (!name.value.trim()) { fieldError(name, 'Name is required'); ok = false; } else fieldError(name, '');
        if (!phone.value.trim()) { fieldError(phone, 'Phone is required'); ok = false; } else fieldError(phone, '');
        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          fieldError(email, 'Valid email is required');
          ok = false;
        } else fieldError(email, '');
      }
      if (n === 1) {
        var type = form.elements.building_type;
        var w = form.elements.width_ft;
        var l = form.elements.length_ft;
        if (!type.value) { fieldError(type, 'Select a building type'); ok = false; } else fieldError(type, '');
        if (!w.value || Number(w.value) < 10) { fieldError(w, 'Enter width in feet'); ok = false; } else fieldError(w, '');
        if (!l.value || Number(l.value) < 10) { fieldError(l, 'Enter length in feet'); ok = false; } else fieldError(l, '');
      }
      if (n === 2) {
        var loc = form.elements.location;
        if (!loc.value.trim()) { fieldError(loc, 'Location or ZIP is required'); ok = false; } else fieldError(loc, '');
      }
      return ok;
    }

    shell.querySelectorAll('[data-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (validateStep(step)) showStep(Math.min(2, step + 1));
      });
    });
    shell.querySelectorAll('[data-back]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showStep(Math.max(0, step - 1));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateStep(2)) return;

      if (FORMSPREE_ENDPOINT.indexOf('YOUR_FORM_ID') !== -1) {
        // SETUP MODE: form UI works for review; replace FORMSPREE_ENDPOINT for live delivery.
        // Also open a prefilled mailto as interim fallback until Formspree is connected.
        try {
          var w = form.elements.width_ft.value;
          var l = form.elements.length_ft.value;
          var body =
            'Name: ' + form.elements.name.value +
            '\nPhone: ' + form.elements.phone.value +
            '\nEmail: ' + form.elements.email.value +
            '\nType: ' + form.elements.building_type.value +
            '\nSize: ' + w + ' x ' + l + ' x ' + (form.elements.eave_height_ft.value || '?') +
            '\nLocation: ' + form.elements.location.value +
            '\nUse: ' + (form.elements.intended_use.value || '') +
            '\nTimeline: ' + (form.elements.timeline.value || '') +
            '\nMessage: ' + (form.elements.message.value || '');
          window.location.href =
            'mailto:info@stampssteel.com?subject=' +
            encodeURIComponent('Stamps Steel quote request') +
            '&body=' + encodeURIComponent(body);
        } catch (err) { /* ignore */ }
        showSuccess();
        return;
      }

      var submitBtn = form.querySelector('[data-submit]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      alertBox.classList.remove('is-visible');

      var fd = new FormData(form);
      var w = Number(form.elements.width_ft.value) || 0;
      var l = Number(form.elements.length_ft.value) || 0;
      var h = form.elements.eave_height_ft.value;
      fd.set('approx_size', w + ' × ' + l + (h ? ' × ' + h : '') + ' ft');
      fd.set('approx_sqft', String(w * l));

      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Submit failed');
          return res.json().catch(function () { return {}; });
        })
        .then(function () {
          showSuccess();
        })
        .catch(function () {
          alertBox.textContent =
            'We couldn’t send the form right now. Please call (615) 629-8217 or email info@stampssteel.com.';
          alertBox.classList.add('is-visible');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send free quote request';
        });
    });

    function showSuccess() {
      form.hidden = true;
      shell.querySelector('.sq-steps').hidden = true;
      shell.querySelector('.sq-step-label').hidden = true;
      success.hidden = false;
    }
  }

  function init() {
    document.querySelectorAll('[data-stamps-quote]').forEach(buildForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
