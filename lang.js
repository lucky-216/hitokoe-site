// EN · VI. <head> sets data-lang before the page paints (hkPick); this file
// wires the switch, the shots and the title once the page is read.
(function () {
  var html = document.documentElement;

  function store(l) {
    try { localStorage.setItem('lang', l); } catch (e) {}
  }

  function set(l) {
    html.setAttribute('data-lang', l);
    html.lang = l;
    document.querySelectorAll('[data-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set') === l));
    });
    // A shot in the page's language: shots/<lang>/<name>.webp.
    document.querySelectorAll('img[data-shot]').forEach(function (img) {
      img.src = 'shots/' + l + '/' + img.getAttribute('data-shot') + '.webp';
      var alt = img.getAttribute('data-alt-' + l);
      if (alt) img.alt = alt;
    });
    var title = html.getAttribute('data-title-' + l);
    if (title) document.title = title;
    document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-set]');
    if (!b) return;
    var l = b.getAttribute('data-set');
    store(l);
    set(l);
  });

  set(html.getAttribute('data-lang') === 'vi' ? 'vi' : 'en');
})();
