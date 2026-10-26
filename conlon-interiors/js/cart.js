/* =========================================================================
   Conlon Interiors — basket (localStorage) and slide-out drawer
   ========================================================================= */
(function () {
  const KEY = 'ci_cart_v1';
  const D = window.SITE.delivery;

  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const save = (items) => { localStorage.setItem(KEY, JSON.stringify(items)); render(); document.dispatchEvent(new CustomEvent('cart:change', { detail: items })); };

  function product(id) { return window.CATALOGUE.products.find(p => p.id === id); }

  /* Options may carry price adders written as "(+€95)" in the option label */
  function adder(label) { const m = /\(\+€\s?([\d.,]+)\)/.exec(label || ''); return m ? parseFloat(m[1].replace(',', '')) : 0; }

  function unitPrice(p, options) {
    let price = p.price;
    Object.values(options || {}).forEach(v => { price += adder(v); });
    return price;
  }

  function lineKey(id, options) { return id + '|' + Object.entries(options || {}).map(([k, v]) => `${k}=${v}`).sort().join('&'); }

  function add(id, qty = 1, options = {}) {
    const p = product(id); if (!p) return;
    const items = load();
    const key = lineKey(id, options);
    const line = items.find(l => l.key === key);
    if (line) line.qty += qty;
    else items.push({ key, id, qty, options, unit: unitPrice(p, options) });
    save(items);
    toast(`<span>Added <strong>${esc(p.name)}</strong> to your basket.</span><a href="cart.html">View basket</a>`);
    open();
  }
  function remove(key) { save(load().filter(l => l.key !== key)); }
  function setQty(key, qty) { const items = load(); const l = items.find(x => x.key === key); if (!l) return; l.qty = Math.max(1, Math.min(99, qty | 0)); save(items); }
  function clear() { save([]); }
  function count() { return load().reduce((n, l) => n + l.qty, 0); }
  function subtotal() { return load().reduce((n, l) => n + l.qty * l.unit, 0); }

  function deliveryFee(method, county) {
    if (method === 'collect') return 0;
    const sub = subtotal();
    if (sub >= D.freeOver) return 0;
    if (!county) return D.localFee;
    return D.localCounties.includes(county) ? D.localFee : D.nationalFee;
  }
  function hasBespoke() { return load().some(l => (product(l.id) || {}).type === 'bespoke'); }

  /* ---------- drawer ---------- */
  function ensureDrawer() {
    if (qs('#cartDrawer')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="drawer-backdrop" id="cartBackdrop"></div>
      <aside class="drawer" id="cartDrawer" aria-label="Basket" aria-hidden="true">
        <div class="drawer__head"><h3>Your basket</h3><button class="icon-btn" id="cartClose" aria-label="Close basket">${ICONS.close}</button></div>
        <div class="drawer__body" id="drawerBody"></div>
        <div class="drawer__foot" id="drawerFoot"></div>
      </aside>`);
    qs('#cartClose').addEventListener('click', close);
    qs('#cartBackdrop').addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }
  function open() { ensureDrawer(); render(); qs('#cartDrawer').classList.add('is-open'); qs('#cartBackdrop').classList.add('is-open'); qs('#cartDrawer').setAttribute('aria-hidden', 'false'); }
  function close() { const d = qs('#cartDrawer'); if (!d) return; d.classList.remove('is-open'); qs('#cartBackdrop').classList.remove('is-open'); d.setAttribute('aria-hidden', 'true'); }

  function lineHtml(l) {
    const p = product(l.id); if (!p) return '';
    const opts = Object.entries(l.options || {}).map(([k, v]) => `${k}: ${v}`).join(' · ');
    const unitLabel = p.unit ? ` <small>${p.unit}</small>` : '';
    return `<div class="cart-line" data-key="${esc(l.key)}">
      <a href="product.html?id=${p.id}"><img src="${imgUrl(p.img, true)}" alt=""></a>
      <div>
        <div class="cart-line__name">${esc(p.name)}</div>
        <div class="cart-line__meta">${esc(opts)}${opts ? ' · ' : ''}${money(l.unit)}${unitLabel}</div>
        <div style="display:flex;align-items:center;gap:12px;margin-top:8px">
          <div class="qty"><button data-dec aria-label="Decrease">−</button><input type="number" value="${l.qty}" min="1" max="99" aria-label="Quantity"><button data-inc aria-label="Increase">+</button></div>
          <button class="cart-line__remove" data-remove>Remove</button>
        </div>
      </div>
      <div class="cart-line__price">${money(l.qty * l.unit)}</div>
    </div>`;
  }

  function bindLines(container) {
    qsa('.cart-line', container).forEach(row => {
      const key = row.dataset.key;
      const input = qs('input', row);
      qs('[data-dec]', row).addEventListener('click', () => setQty(key, (+input.value) - 1));
      qs('[data-inc]', row).addEventListener('click', () => setQty(key, (+input.value) + 1));
      input.addEventListener('change', () => setQty(key, +input.value));
      qs('[data-remove]', row).addEventListener('click', () => remove(key));
    });
  }

  function render() {
    const n = count();
    const badge = qs('#cartCount');
    if (badge) { badge.textContent = n || ''; badge.dataset.zero = n ? 'false' : 'true'; }
    const body = qs('#drawerBody'); const foot = qs('#drawerFoot');
    if (body) {
      const items = load();
      body.innerHTML = items.length ? items.map(lineHtml).join('') : `<div class="empty"><p>Your basket is empty.</p><a class="btn btn--primary btn--sm" href="shop.html">Browse the shop</a></div>`;
      bindLines(body);
      const sub = subtotal();
      foot.innerHTML = items.length ? `
        <div class="totals"><div><span>Subtotal</span><strong>${money(sub)}</strong></div></div>
        ${HUMM.eligible(sub) ? `<p class="humm-line" style="margin-bottom:12px"><span class="humm-tag">humm</span> or from <strong>&nbsp;${money(HUMM.monthly(sub, SITE.humm.defaultTerm))}</strong>/month over ${SITE.humm.defaultTerm} months*</p>` : ''}
        <a class="btn btn--primary btn--block" href="checkout.html">Checkout</a>
        <a class="btn btn--ghost btn--block" style="margin-top:8px" href="cart.html">View basket</a>` : '';
    }
    document.dispatchEvent(new CustomEvent('cart:render'));
  }

  document.addEventListener('site:ready', () => {
    ensureDrawer(); render();
    qs('#cartOpen')?.addEventListener('click', open);
  });

  window.CART = { load, add, remove, setQty, clear, count, subtotal, deliveryFee, hasBespoke, open, close, render, lineHtml, bindLines, product, unitPrice };
})();
