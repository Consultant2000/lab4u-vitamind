/**
 * Lab4U CMS Loader
 * Читает content.json и обновляет страницу.
 * Работает только если content.json изменился через Decap CMS.
 */
(function () {
  fetch('/content.json')
    .then(function (r) { return r.json(); })
    .then(function (d) { applyContent(d); })
    .catch(function () { /* файл не найден или ошибка — оставляем HTML как есть */ });

  function set(sel, html) {
    var el = document.querySelector(sel);
    if (el) el.innerHTML = html;
  }
  function setSrc(sel, src) {
    var el = document.querySelector(sel);
    if (el) el.src = src;
  }
  function setHref(sel, href) {
    var el = document.querySelector(sel);
    if (el) el.href = href;
  }

  function applyContent(d) {
    var h = d.hero, b = d.benefits, a = d.analysis,
        cd = d.cta_dosage, st = d.stats, pr = d.products,
        ar = d.articles, re = d.research, hl = d.health, fo = d.footer;

    /* ── HERO ── */
    set('.hero__title', h.title);
    set('.hero__subtitle', h.subtitle);
    var heroBtn = document.querySelector('.hero__card .btn--white');
    if (heroBtn) { heroBtn.textContent = h.cta_text; heroBtn.href = h.cta_url; }

    /* ── BENEFITS ── */
    set('[data-section="benefits"] .section__title', b.title);
    var bcards = document.querySelectorAll('[data-section="benefits"] .benefit-card');
    b.items.forEach(function (item, i) {
      if (!bcards[i]) return;
      var img = bcards[i].querySelector('img');
      var heading = bcards[i].querySelector('.benefit-card__heading');
      var p = bcards[i].querySelector('p');
      if (img) img.src = item.image;
      if (heading) heading.textContent = item.heading;
      if (p) p.textContent = item.text;
    });
    var bBtn = document.querySelector('[data-section="benefits"] .section__cta .btn');
    if (bBtn) { bBtn.textContent = b.cta_text; bBtn.href = b.cta_url; }

    /* ── ANALYSIS ── */
    set('[data-section="analysis"] .section__title', a.title);
    var apoints = document.querySelectorAll('[data-section="analysis"] .analysis-point');
    a.points.forEach(function (item, i) {
      if (!apoints[i]) return;
      var h3 = apoints[i].querySelector('h3');
      var p = apoints[i].querySelector('p');
      if (h3) h3.textContent = item.heading;
      if (p) p.textContent = item.text;
    });
    setSrc('[data-section="analysis"] .analysis-image img', a.image);
    var aBtn = document.querySelector('[data-section="analysis"] .section__cta .btn');
    if (aBtn) { aBtn.textContent = a.cta_text; aBtn.href = a.cta_url; }

    /* ── CTA DOSAGE ── */
    set('[data-section="cta_dosage"] .section__title', cd.title);
    set('[data-section="cta_dosage"] .cta-card__heading', cd.card_heading);
    set('[data-section="cta_dosage"] .form-footnote', cd.footnote);
    var cdBtn = document.querySelector('[data-section="cta_dosage"] .btn--gradient-cyan');
    if (cdBtn) { cdBtn.textContent = cd.cta_text; cdBtn.href = cd.cta_url; }

    /* ── STATS ── */
    set('[data-section="stats"] .section__title', st.title);
    var scards = document.querySelectorAll('[data-section="stats"] .stats-card');
    st.cards.forEach(function (item, i) {
      if (!scards[i]) return;
      var img = scards[i].querySelector('img');
      var h3 = scards[i].querySelector('h3');
      var p = scards[i].querySelector('p, .stats-card__text');
      if (img && item.image) img.src = item.image;
      if (h3 && item.heading) h3.textContent = item.heading;
      if (p) p.textContent = item.text;
    });
    var stBtn = document.querySelector('[data-section="stats"] .section__cta .btn');
    if (stBtn) { stBtn.textContent = st.cta_text; stBtn.href = st.cta_url; }

    /* ── PRODUCTS ── */
    set('[data-section="products"] .section__title', pr.title);
    var pcards = document.querySelectorAll('[data-section="products"] .product-card');
    pr.items.forEach(function (item, i) {
      if (!pcards[i]) return;
      var img = pcards[i].querySelector('img');
      var name = pcards[i].querySelector('.product-card__name');
      if (img) img.src = item.image;
      if (name) name.textContent = item.name;
    });

    /* ── ARTICLES ── */
    set('[data-section="articles"] .section__title', ar.title);
    var acards = document.querySelectorAll('[data-section="articles"] .article-card');
    ar.items.forEach(function (item, i) {
      if (!acards[i]) return;
      var img = acards[i].querySelector('img');
      var h3 = acards[i].querySelector('h3');
      var p = acards[i].querySelector('p');
      var badge = acards[i].querySelector('.badge__text');
      var link = acards[i].querySelector('.btn');
      if (img) img.src = item.image;
      if (h3) h3.textContent = item.title;
      if (p) p.textContent = item.text;
      if (badge) badge.textContent = item.badge;
      if (link) link.href = item.url;
    });

    /* ── RESEARCH ── */
    set('[data-section="research"] .section__title', re.title);
    var rcards = document.querySelectorAll('[data-section="research"] .research-card');
    re.items.forEach(function (item, i) {
      if (!rcards[i]) return;
      rcards[i].href = item.url;
      var p = rcards[i].querySelector('p');
      var img = rcards[i].querySelector('.research-card__img');
      if (p) p.textContent = item.text;
      if (img && item.image) img.src = item.image;
    });

    /* ── HEALTH ── */
    set('[data-section="health"] .section__title', hl.title);
    var hcards = document.querySelectorAll('[data-section="health"] .health-card');
    hl.items.forEach(function (item, i) {
      if (!hcards[i]) return;
      var badge = hcards[i].querySelector('.badge__text');
      var inner = hcards[i].querySelector('.health-card__inner');
      var h3 = hcards[i].querySelector('h3');
      var days = hcards[i].querySelector('.health-card__days');
      var img = hcards[i].querySelector('.health-card__img');
      if (badge) badge.textContent = item.badge;
      if (inner && item.bg) inner.style.background = item.bg;
      if (h3) h3.textContent = item.title;
      if (days) days.textContent = item.days;
      if (img) img.src = item.image;
    });
    var hlBtn = document.querySelector('[data-section="health"] .section__cta .btn');
    if (hlBtn) { hlBtn.textContent = hl.cta_text; hlBtn.href = hl.cta_url; }

    /* ── FOOTER ── */
    set('.footer__logo', fo.logo);
    set('.footer__copy', fo.copy);
  }
})();
