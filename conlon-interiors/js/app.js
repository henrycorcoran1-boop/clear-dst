/* =========================================================================
   Conlon Interiors — shared behaviour: header, footer, utilities
   ========================================================================= */
(function () {
  const S = window.SITE;
  const B = S.business;

  /* ---------- helpers ---------- */
  const fmt = new Intl.NumberFormat(S.currency.locale, { style: 'currency', currency: S.currency.code, minimumFractionDigits: 2 });
  window.money = (n) => fmt.format(Number(n) || 0);
  window.money0 = (n) => new Intl.NumberFormat(S.currency.locale, { style: 'currency', currency: S.currency.code, maximumFractionDigits: 0 }).format(Number(n) || 0);
  window.qs = (sel, el) => (el || document).querySelector(sel);
  window.qsa = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  window.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  window.param = (k) => new URLSearchParams(location.search).get(k);
  window.imgUrl = (base, small) => `assets/img/${base}${small ? '-sm' : ''}.jpg`;

  const icons = {
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h15l-1.5 8.5H7.5L6 6z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M3 7h18M3 12h18M3 17h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 5l14 14M19 5 5 19"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4V14h2.8v8h3.3z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.1.6 2.8.5a2.4 2.4 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c0-.1-.2-.2-.5-.3z"/></svg>'
  };
  window.ICONS = icons;

  const pages = [
    ['index.html', 'Home'], ['shop.html', 'Shop'], ['services.html', 'Bespoke Carpentry'], ['gallery.html', 'Gallery'],
    ['finance.html', 'Pay with humm'], ['about.html', 'About'], ['contact.html', 'Contact']
  ];
  const current = (location.pathname.split('/').pop() || 'index.html');

  /* ---------- header ---------- */
  function header() {
    const over = document.body.dataset.header === 'over';
    const navLinks = pages.slice(1).map(([h, t]) => `<a href="${h}" ${current === h ? 'aria-current="page"' : ''}>${t}</a>`).join('');
    const logo = over ? 'assets/brand/logo-horizontal-white.svg' : 'assets/brand/logo-horizontal-charcoal.svg';
    return `
      <div class="topbar">
        <div class="wrap">
          <span>Showroom: ${B.address.line1}, ${B.address.town} · <a href="${B.mapsUrl}" target="_blank" rel="noopener">Get directions</a></span>
          <div class="topbar__right">
            <span>Open Mon–Sat 9–5 · Sun & Bank Hols 11–4</span>
            <span><a href="tel:${B.phone}">${B.phoneDisplay}</a></span>
            <span><a href="finance.html">Spread the cost with <strong style="color:var(--ember)">humm</strong></a></span>
          </div>
        </div>
      </div>
      <header class="site-header ${over ? 'site-header--over' : ''}" id="siteHeader">
        <div class="wrap header-inner">
          <a class="brand" href="index.html" aria-label="${B.name} home">
            <img src="${logo}" alt="${B.name}" width="300" height="48">
          </a>
          <nav class="nav" aria-label="Primary">${navLinks}</nav>
          <div class="header-actions">
            <a class="icon-btn" href="tel:${B.phone}" aria-label="Call us">${icons.phone}</a>
            <button class="icon-btn" id="cartOpen" aria-label="Open basket">${icons.cart}<span class="cart-count" id="cartCount" data-zero="true"></span></button>
            <button class="icon-btn nav-toggle" id="navOpen" aria-label="Open menu">${icons.menu}</button>
          </div>
        </div>
      </header>
      <div class="mobile-nav" id="mobileNav" aria-hidden="true">
        <div class="mobile-nav__head">
          <img src="assets/brand/logo-horizontal-white.svg" alt="" style="height:44px">
          <button class="icon-btn" id="navClose" aria-label="Close menu">${icons.close}</button>
        </div>
        ${pages.map(([h, t]) => `<a class="mobile-nav__link" href="${h}">${t}</a>`).join('')}
        <div class="mobile-nav__foot">
          <p><a href="tel:${B.phone}">${B.phoneDisplay}</a> · <a href="https://wa.me/${B.whatsapp}">WhatsApp</a></p>
          <p>${B.address.line1}, ${B.address.town}, ${B.address.county}</p>
        </div>
      </div>`;
  }

  /* ---------- footer ---------- */
  function footer() {
    const year = new Date().getFullYear();
    return `
      <footer class="site-footer">
        <div class="wrap">
          <div class="footer-grid">
            <div>
              <img class="footer-logo" src="assets/brand/logo-wordmark-white.svg" alt="${B.name}">
              <p>Qualified carpenters making feature walls, fitted units, wardrobes and panelling, with a showroom full of flooring, doors and furniture in Newbridge, Co. Kildare.</p>
              <div class="social">
                <a href="${B.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icons.fb}</a>
                ${B.instagram ? `<a href="${B.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icons.ig}</a>` : ''}
                <a href="https://wa.me/${B.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${icons.wa}</a>
              </div>
            </div>
            <div>
              <h4>Shop</h4>
              <ul>
                ${window.CATALOGUE ? window.CATALOGUE.categories.map(c => `<li><a href="shop.html?cat=${c.id}">${c.name}</a></li>`).join('') : ''}
                <li><a href="finance.html">Pay with humm</a></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="about.html">About us</a></li>
                <li><a href="services.html">Bespoke carpentry</a></li>
                <li><a href="gallery.html">Our work</a></li>
                <li><a href="contact.html">Contact & showroom</a></li>
                <li><a href="delivery.html">Delivery & returns</a></li>
                <li><a href="terms.html">Terms of sale</a></li>
                <li><a href="privacy.html">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4>Showroom</h4>
              <p>${B.address.line1}<br>${B.address.town}, ${B.address.county}<br>${B.address.eircode}</p>
              <p><a href="tel:${B.phone}">${B.phoneDisplay}</a><br><a href="mailto:${B.email}">${B.email}</a></p>
              <p>${B.hours.map(h => `${h.days}: ${h.time}`).join('<br>')}</p>
            </div>
          </div>
          <div class="footer-humm">
            <span class="humm-logo">humm</span> ${S.humm.legal.disclaimer}<br>${S.humm.legal.warning}<br>${S.humm.legal.regulated}
          </div>
          <div class="footer-bottom">
            <span>© ${year} ${B.legalName}. All rights reserved. ${B.vatNote}</span>
            <span>Newbridge, Co. Kildare, Ireland</span>
          </div>
        </div>
      </footer>
      <a class="wa-float" href="https://wa.me/${B.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icons.wa}</a>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const h = qs('#header'); if (h) h.innerHTML = header();
    const f = qs('#footer'); if (f) f.innerHTML = footer();

    // header scroll state
    const sh = qs('#siteHeader');
    if (sh && sh.classList.contains('site-header--over')) {
      const onScroll = () => sh.classList.toggle('is-scrolled', window.scrollY > 40);
      onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    }

    // mobile nav
    const mn = qs('#mobileNav');
    qs('#navOpen')?.addEventListener('click', () => { mn.classList.add('is-open'); mn.setAttribute('aria-hidden', 'false'); });
    qs('#navClose')?.addEventListener('click', () => { mn.classList.remove('is-open'); mn.setAttribute('aria-hidden', 'true'); });

    // reveal on scroll
    const io = new IntersectionObserver((entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), { threshold: .12 });
    qsa('.reveal').forEach(el => io.observe(el));

    document.dispatchEvent(new CustomEvent('site:ready'));
  });

  /* ---------- toast ---------- */
  let toastTimer;
  window.toast = (html, ms = 3200) => {
    const t = qs('#toast'); if (!t) return;
    t.innerHTML = html; t.classList.add('is-visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('is-visible'), ms);
  };
})();
