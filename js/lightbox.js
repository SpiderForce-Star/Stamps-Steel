/**
 * Lightweight multi-image lightbox for [data-lightbox] images / galleries.
 */
(function () {
  'use strict';

  var items = [];
  var index = 0;
  var box, img, cap, prevBtn, nextBtn;

  function ensureUi() {
    if (box) return;
    box = document.createElement('div');
    box.className = 'stamps-lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Image viewer');
    box.innerHTML =
      '<button type="button" class="slb-close" aria-label="Close">×</button>' +
      '<button type="button" class="slb-prev" aria-label="Previous">‹</button>' +
      '<img src="" alt="">' +
      '<button type="button" class="slb-next" aria-label="Next">›</button>' +
      '<div class="slb-cap"></div>';
    document.body.appendChild(box);
    img = box.querySelector('img');
    cap = box.querySelector('.slb-cap');
    prevBtn = box.querySelector('.slb-prev');
    nextBtn = box.querySelector('.slb-next');
    box.querySelector('.slb-close').addEventListener('click', close);
    prevBtn.addEventListener('click', function () { show(index - 1); });
    nextBtn.addEventListener('click', function () { show(index + 1); });
    box.addEventListener('click', function (e) {
      if (e.target === box) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  function collect(group) {
    if (group) {
      return Array.prototype.slice.call(
        document.querySelectorAll('[data-lightbox="' + group + '"]')
      );
    }
    return Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  }

  function open(el) {
    ensureUi();
    var group = el.getAttribute('data-lightbox');
    items = collect(group === 'true' || group === '' ? null : group);
    if (!items.length) items = [el];
    index = Math.max(0, items.indexOf(el));
    show(index);
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function show(i) {
    if (!items.length) return;
    index = (i + items.length) % items.length;
    var el = items[index];
    var src = el.getAttribute('data-full') || el.currentSrc || el.src;
    img.src = src;
    img.alt = el.alt || '';
    cap.textContent = el.getAttribute('data-caption') || el.alt || '';
    prevBtn.style.display = items.length > 1 ? 'flex' : 'none';
    nextBtn.style.display = items.length > 1 ? 'flex' : 'none';
  }

  function close() {
    if (!box) return;
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    img.src = '';
  }

  function init() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-lightbox]');
      if (!t) return;
      e.preventDefault();
      open(t);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
