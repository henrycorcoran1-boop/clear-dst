/* =========================================================================
   Conlon Interiors — product detail page
   ========================================================================= */
(function () {
  const C = window.CATALOGUE;
  const B = window.SITE.business;
  const id = param('id');
  const p = C.products.find(x => x.id === id);
  const layout = qs('#productLayout');

  document.addEventListener('site:ready', () => {
    if (!p) {
      layout.innerHTML = `<div class="empty" style="grid-column:1/-1"><h2>We couldn’t find that product.</h2><a class="btn btn--primary" href="shop.html">Back to the shop</a></div>`;
      return;
    }
    const cat = C.categories.find(c => c.id === p.category);
    document.title = `${p.name} | Conlon Interiors`;
    qs('#crumb').innerHTML = `<a href="index.html">Home</a><span>/</span><a href="shop.html">Shop</a><span>/</span><a href="shop.html?cat=${cat.id}">${esc(cat.name)}</a><span>/</span><span>${esc(p.name)}</span>`;

    const selected = {}; Object.entries(p.options || {}).forEach(([k, v]) => selected[k] = v[0]);
    const unitLabel = p.unit ? ` <small>${esc(p.unit)}</small>` : '';
    const isBespoke = p.type === 'bespoke';
    const isArea = p.type === 'per-m2';

    layout.innerHTML = `
      <div>
        <div class="gallery__main"><img id="mainImg" src="${imgUrl(p.images[0])}" alt="${esc(p.name)}">${p.badge ? `<span class="badge ${p.badge === 'New' ? 'badge--ember' : ''}">${esc(p.badge)}</span>` : ''}</div>
        ${p.images.length > 1 ? `<div class="gallery__thumbs">${p.images.map((im, i) => `<button class="${i === 0 ? 'is-active' : ''}" data-img="${im}" aria-label="View image ${i + 1}"><img src="${imgUrl(im, true)}" alt=""></button>`).join('')}</div>` : ''}
      </div>
      <div class="product-info">
        <span class="eyebrow">${esc(cat.name)}</span>
        <h1>${esc(p.name)}</h1>
        <p class="lede">${esc(p.short)}</p>
        <span class="price" id="priceDisplay">${p.from ? '<span class="price__from">From</span>' : ''}${money(p.price)}${unitLabel}</span>
        <div id="hummLine">${!isArea ? HUMM.fromLine(p.price) : ''}</div>

        ${Object.entries(p.options || {}).map(([k, vals]) => `
          <div class="option"><label>${esc(k)}</label><div class="chips" data-opt="${esc(k)}">${vals.map((v, i) => `<button class="chip ${i === 0 ? 'is-active' : ''}" data-val="${esc(v)}">${esc(v)}</button>`).join('')}</div></div>`).join('')}

        ${isBespoke ? `
          <div class="notice notice--info" style="margin:20px 0">Bespoke pieces are priced after a free measure-up. Tell us about the room and we’ll come back with a drawing and a fixed quote, with humm finance figures if you want them.</div>
          <div class="buy-row">
            <a class="btn btn--ember btn--lg" href="contact.html?subject=${encodeURIComponent('Quote: ' + p.name)}">Request a free quote</a>
            <a class="btn btn--ghost btn--lg" href="https://wa.me/${B.whatsapp}?text=${encodeURIComponent('Hi, I would like a quote for a ' + p.name.toLowerCase() + '.')}" target="_blank" rel="noopener">WhatsApp us</a>
          </div>` : `
          <div class="option"><label>${isArea ? 'Quantity (' + (p.unit || '').replace('per ', '') + ')' : 'Quantity'}</label>
            <div class="qty"><button id="qDec" aria-label="Decrease">−</button><input type="number" id="qty" value="${isArea ? 20 : 1}" min="1" max="999"><button id="qInc" aria-label="Increase">+</button></div>
            ${isArea ? '<p style="font-size:.8rem;color:var(--muted);margin:8px 0 0">Measure the room length × width in metres and add 10% for cutting. Fitting quoted separately.</p>' : ''}
          </div>
          <div class="buy-row">
            <button class="btn btn--primary btn--lg" id="addBtn">Add to basket · <span id="lineTotal">${money(p.price * (isArea ? 20 : 1))}</span></button>
          </div>
          <div class="buy-row" style="margin-top:0">
            <a class="btn btn--ghost btn--sm" href="https://wa.me/${B.whatsapp}?text=${encodeURIComponent('Hi, I have a question about the ' + p.name + '.')}" target="_blank" rel="noopener">Ask a question on WhatsApp</a>
          </div>`}

        <div id="hummBox"></div>

        <h3 style="margin-top:28px;font-size:1.3rem">About this piece</h3>
        <p style="color:var(--steel)">${esc(p.description)}</p>
        <ul class="specs">${(p.specs || []).map(s => `<li>${esc(s)}</li>`).join('')}<li>Lead time: ${esc(p.lead)}</li></ul>
        <div class="trust">
          <div><strong>Delivery</strong>Ireland-wide, free over ${money0(SITE.delivery.freeOver)}</div>
          <div><strong>Collection</strong>Free from Newbridge</div>
          <div><strong>Pay with humm</strong>Spread the cost</div>
        </div>
      </div>`;

    // gallery
    qsa('.gallery__thumbs button').forEach(b => b.addEventListener('click', () => {
      qs('#mainImg').src = imgUrl(b.dataset.img);
      qsa('.gallery__thumbs button').forEach(x => x.classList.remove('is-active')); b.classList.add('is-active');
    }));

    // options
    qsa('.chips').forEach(group => qsa('.chip', group).forEach(ch => ch.addEventListener('click', () => {
      qsa('.chip', group).forEach(x => x.classList.remove('is-active')); ch.classList.add('is-active');
      selected[group.dataset.opt] = ch.dataset.val; refresh();
    })));

    const qty = qs('#qty');
    qs('#qDec')?.addEventListener('click', () => { qty.value = Math.max(1, +qty.value - 1); refresh(); });
    qs('#qInc')?.addEventListener('click', () => { qty.value = Math.min(999, +qty.value + 1); refresh(); });
    qty?.addEventListener('input', refresh);

    function unit() { return CART.unitPrice(p, selected); }
    function total() { return unit() * (qty ? Math.max(1, +qty.value || 1) : 1); }
    function refresh() {
      const u = unit();
      qs('#priceDisplay').innerHTML = `${p.from ? '<span class="price__from">From</span>' : ''}${money(u)}${unitLabel}`;
      const lt = qs('#lineTotal'); if (lt) lt.textContent = money(total());
      qs('#hummLine').innerHTML = HUMM.fromLine(isArea ? total() : u);
      const box = qs('#hummBox'); box.innerHTML = HUMM.box(isBespoke ? p.price : total()); HUMM.bind(box);
    }
    refresh();

    qs('#addBtn')?.addEventListener('click', () => CART.add(p.id, Math.max(1, +qty.value || 1), { ...selected }));

    // related
    const rel = C.products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
    if (rel.length) { qs('#relatedSection').hidden = false; qs('#related').innerHTML = rel.map(productCard).join(''); qsa('#related .reveal').forEach(el => el.classList.add('is-visible')); }
  });
})();
