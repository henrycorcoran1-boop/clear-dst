/* =========================================================================
   Conlon Interiors — product cards and shop listing
   ========================================================================= */
(function () {
  const C = window.CATALOGUE;
  const catName = (id) => (C.categories.find(c => c.id === id) || {}).name || '';

  window.productCard = function (p) {
    const from = p.from ? '<span class="price__from">From</span>' : '';
    const unit = p.unit ? ` <small>${esc(p.unit)}</small>` : '';
    const cta = p.type === 'bespoke'
      ? `<a class="btn btn--ghost btn--sm" href="product.html?id=${p.id}">Enquire</a>`
      : `<button class="btn btn--primary btn--sm" data-add="${p.id}">Add to basket</button>`;
    return `
      <article class="product-card reveal">
        <a class="product-card__media" href="product.html?id=${p.id}">
          <img src="${imgUrl(p.img, true)}" alt="${esc(p.name)}" loading="lazy">
          ${p.badge ? `<span class="badge ${p.badge === 'New' ? 'badge--ember' : ''}">${esc(p.badge)}</span>` : ''}
        </a>
        <div class="product-card__body">
          <span class="product-card__cat">${esc(catName(p.category))}</span>
          <h3 class="product-card__name"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
          <p class="product-card__short">${esc(p.short)}</p>
          <div class="product-card__foot">
            <div><div class="price">${from}${money(p.price)}${unit}</div>${p.type !== 'per-m2' ? HUMM.fromLine(p.price) : ''}</div>
            ${cta}
          </div>
        </div>
      </article>`;
  };

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (b) { e.preventDefault(); const p = C.products.find(x => x.id === b.dataset.add); const opts = {}; Object.entries(p.options || {}).forEach(([k, v]) => opts[k] = v[0]); CART.add(p.id, 1, opts); }
  });

  /* ---------- shop page ---------- */
  const grid = qs('#shopGrid');
  if (!grid) return;

  const state = { cat: param('cat') || 'all', sort: 'featured', q: (param('q') || '').toLowerCase() };

  function filtered() {
    let list = C.products.slice();
    if (state.cat !== 'all') list = list.filter(p => p.category === state.cat);
    if (state.q) list = list.filter(p => (p.name + ' ' + p.short + ' ' + p.description).toLowerCase().includes(state.q));
    switch (state.sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
    return list;
  }

  function renderFilters() {
    const counts = {}; C.products.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1);
    qs('#filterList').innerHTML = [`<li><button class="${state.cat === 'all' ? 'is-active' : ''}" data-cat="all">All products <span>${C.products.length}</span></button></li>`]
      .concat(C.categories.map(c => `<li><button class="${state.cat === c.id ? 'is-active' : ''}" data-cat="${c.id}">${esc(c.name)} <span>${counts[c.id] || 0}</span></button></li>`)).join('');
    qsa('[data-cat]').forEach(b => b.addEventListener('click', () => { state.cat = b.dataset.cat; const u = new URL(location); u.searchParams.set('cat', state.cat); history.replaceState(null, '', u); render(); }));
  }

  function render() {
    const list = filtered();
    const c = C.categories.find(x => x.id === state.cat);
    qs('#shopTitle').textContent = c ? c.name : 'All products';
    qs('#shopBlurb').textContent = c ? c.blurb : 'Furniture, doors and flooring from the Newbridge showroom, plus bespoke carpentry made to measure.';
    qs('#shopCount').textContent = `${list.length} ${list.length === 1 ? 'item' : 'items'}`;
    grid.innerHTML = list.length ? list.map(productCard).join('') : '<div class="empty">Nothing matches that search yet. <a href="shop.html" style="text-decoration:underline">See everything</a>.</div>';
    qsa('.reveal', grid).forEach(el => el.classList.add('is-visible'));
    qsa('[data-cat]').forEach(b => b.classList.toggle('is-active', b.dataset.cat === state.cat));
  }

  document.addEventListener('site:ready', () => {
    renderFilters();
    qs('#sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
    const search = qs('#shopSearch'); if (search) { search.value = state.q; search.addEventListener('input', () => { state.q = search.value.toLowerCase(); render(); }); }
    render();
  });
})();
