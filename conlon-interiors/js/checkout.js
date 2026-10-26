/* =========================================================================
   Conlon Interiors — checkout
   -------------------------------------------------------------------------
   Payment methods
   - humm   : 'assisted' mode (default) — customer is pre-approved at humm,
              places the order here with their humm acceptance code, and the
              shop completes the sale through the humm merchant portal.
              'redirect' mode — customer is sent to SITE.humm.checkoutUrl.
   - transfer: bank transfer / card over the phone, details sent by email.
   - showroom: reserve online, pay in the showroom.
   Orders are POSTed to SITE.orders.endpoint when set, otherwise the
   customer's email client opens with the order pre-filled.
   ========================================================================= */
(function () {
  const S = window.SITE, H = S.humm, D = S.delivery, B = S.business;
  const COUNTIES = ['Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway', 'Kerry', 'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath', 'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 'Waterford', 'Westmeath', 'Wexford', 'Wicklow'];
  const state = { step: 1, delivery: 'deliver', payment: 'humm', hummTerm: H.defaultTerm };

  const f = (id) => qs('#' + id);
  const val = (id) => (f(id)?.value || '').trim();

  function deliveryFee() { return CART.deliveryFee(state.delivery, val('county')); }
  function total() { return CART.subtotal() + deliveryFee(); }

  /* ---------- rendering ---------- */
  function renderDelivery() {
    const sub = CART.subtotal();
    const free = sub >= D.freeOver;
    f('deliveryChoices').innerHTML = `
      <label class="choice ${state.delivery === 'deliver' ? 'is-active' : ''}"><input type="radio" name="delivery" value="deliver" ${state.delivery === 'deliver' ? 'checked' : ''}>
        <div><strong>Home delivery</strong><p>${free ? 'Free on this order.' : `${money(D.localFee)} to ${D.localCounties.slice(0, 4).join(', ')} and nearby; ${money(D.nationalFee)} elsewhere in Ireland. Free over ${money0(D.freeOver)}.`} Two-person delivery to the room of your choice.</p></div>
        <span class="choice__price" id="delPrice">${free ? 'Free' : money(deliveryFee())}</span>
      </label>
      <label class="choice ${state.delivery === 'collect' ? 'is-active' : ''}"><input type="radio" name="delivery" value="collect" ${state.delivery === 'collect' ? 'checked' : ''}>
        <div><strong>Collect from the showroom</strong><p>${D.collectionNote} ${B.address.line1}, ${B.address.town}. We’ll message you when it’s ready.</p></div>
        <span class="choice__price">Free</span>
      </label>`;
    qsa('input[name=delivery]').forEach(r => r.addEventListener('change', () => { state.delivery = r.value; renderDelivery(); renderSummary(); }));
    f('addressBlock').style.display = state.delivery === 'deliver' ? '' : 'none';
  }

  function renderPayment() {
    const amt = total();
    const hummOk = HUMM.eligible(amt);
    f('paymentChoices').innerHTML = `
      <label class="choice ${state.payment === 'humm' ? 'is-active' : ''}" ${hummOk ? '' : 'style="opacity:.55"'}><input type="radio" name="payment" value="humm" ${state.payment === 'humm' ? 'checked' : ''} ${hummOk ? '' : 'disabled'}>
        <div><strong><span class="humm-logo">humm</span>&nbsp; Spread the cost with humm</strong>
          <p>${hummOk ? `Split ${money(amt)} into monthly payments. Interest-free plans available. Get pre-approved in minutes, then enter your humm acceptance code below.` : `humm is available on orders between ${money0(H.minAmount)} and ${money0(H.maxAmount)}.`}</p>
        </div>
        <span class="choice__price">${hummOk ? `from ${money(HUMM.monthly(amt, H.defaultTerm))}/mo` : ''}</span>
        <div class="choice__detail">
          ${H.mode === 'redirect' && H.checkoutUrl ? `<div class="notice notice--info">You’ll be taken to humm’s secure checkout to complete your application and payment after you place the order.</div>` : `
          <div class="humm-plans">${HUMM.plansHtml(amt, state.hummTerm)}</div>
          <div class="humm-warning">${H.legal.warning}</div>
          <ol style="font-size:.88rem;color:var(--steel);padding-left:18px;margin:12px 0">
            <li>Apply at <a href="${H.applyUrl}" target="_blank" rel="noopener" style="text-decoration:underline">apply.humm.ie</a> for an amount equal to or more than ${money(amt)}. Most decisions take about five minutes.</li>
            <li>humm will give you an <strong>acceptance code</strong>. Enter it below (or leave blank and we’ll call you to complete it).</li>
            <li>Place your order. We finalise the humm purchase with you, then build or deliver.</li>
          </ol>
          <div class="form-grid">
            <div class="field full"><label for="hummCode">humm acceptance code <span style="text-transform:none;letter-spacing:0">(optional)</span></label><input id="hummCode" name="hummCode" placeholder="e.g. 123456"></div>
          </div>
          <a class="btn btn--ember btn--sm" href="${H.applyUrl}" target="_blank" rel="noopener" style="margin-top:4px">Get pre-approved with humm</a>
          <p class="humm-legal" style="margin-top:12px">${H.legal.disclaimer} ${H.legal.regulated}</p>`}
        </div>
      </label>
      <label class="choice ${state.payment === 'transfer' ? 'is-active' : ''}"><input type="radio" name="payment" value="transfer" ${state.payment === 'transfer' ? 'checked' : ''}>
        <div><strong>Bank transfer or card over the phone</strong><p>We email you our bank details and an order reference, or call to take card payment. Your order is confirmed once payment clears.</p></div>
        <span class="choice__price">${money(amt)}</span>
      </label>
      <label class="choice ${state.payment === 'showroom' ? 'is-active' : ''}"><input type="radio" name="payment" value="showroom" ${state.payment === 'showroom' ? 'checked' : ''}>
        <div><strong>Reserve now, pay in the showroom</strong><p>We hold your order for 7 days. Pay by card, cash or humm when you call in to Newbridge.</p></div>
        <span class="choice__price">${money(amt)}</span>
      </label>`;
    qsa('input[name=payment]').forEach(r => r.addEventListener('change', () => { state.payment = r.value; renderPayment(); renderSummary(); }));
    qsa('.humm-plan').forEach(p => p.addEventListener('click', (e) => { e.preventDefault(); state.hummTerm = +p.dataset.term; qsa('.humm-plan').forEach(x => x.classList.toggle('is-active', +x.dataset.term === state.hummTerm)); }));
    if (!hummOk && state.payment === 'humm') { state.payment = 'transfer'; renderPayment(); }
  }

  function renderSummary() {
    const items = CART.load();
    const sub = CART.subtotal(), fee = deliveryFee(), tot = sub + fee;
    f('orderSummary').innerHTML = `
      <h3>Order summary</h3>
      ${items.map(l => { const p = CART.product(l.id); const opts = Object.entries(l.options || {}).map(([k, v]) => `${k}: ${v}`).join(' · '); return `<div class="summary-line"><span>${l.qty} × ${esc(p.name)}<small>${esc(opts)}</small></span><span>${money(l.qty * l.unit)}</span></div>`; }).join('')}
      <div class="totals" style="margin-top:14px">
        <div><span>Subtotal</span><span>${money(sub)}</span></div>
        <div><span>${state.delivery === 'collect' ? 'Collection' : 'Delivery'}</span><span>${fee ? money(fee) : 'Free'}</span></div>
        <div class="totals__grand"><span>Total</span><span>${money(tot)}</span></div>
      </div>
      ${state.payment === 'humm' && HUMM.eligible(tot) ? `<p class="humm-line"><span class="humm-tag">humm</span> ${state.hummTerm} payments of <strong>&nbsp;${money(HUMM.monthly(tot, state.hummTerm))}</strong>*</p><p class="humm-legal" style="margin-top:8px">*Illustrative; confirmed by humm at application.</p>` : ''}
      <p style="font-size:.78rem;color:var(--muted);margin-top:14px">${B.vatNote}</p>`;
  }

  function renderReview() {
    const payLabel = { humm: 'humm instalments', transfer: 'Bank transfer / card by phone', showroom: 'Pay in the showroom' }[state.payment];
    f('review').innerHTML = `
      <div class="summary-line"><span>Name</span><span>${esc(val('firstName'))} ${esc(val('lastName'))}</span></div>
      <div class="summary-line"><span>Contact</span><span>${esc(val('email'))}<br>${esc(val('phone'))}</span></div>
      <div class="summary-line"><span>${state.delivery === 'collect' ? 'Collection' : 'Deliver to'}</span><span>${state.delivery === 'collect' ? 'Conlon Interiors showroom, Newbridge' : [val('address1'), val('address2'), val('town'), val('county'), val('eircode')].filter(Boolean).map(esc).join('<br>')}</span></div>
      <div class="summary-line"><span>Payment</span><span>${payLabel}${state.payment === 'humm' && val('hummCode') ? `<br><small>Acceptance code: ${esc(val('hummCode'))}</small>` : ''}</span></div>
      <div class="summary-line"><span>Total</span><strong>${money(total())}</strong></div>`;
    f('placeNote').textContent = S.orders.endpoint ? 'Placing your order sends it securely to our team. We confirm by email or phone within one working day.' : 'Placing your order opens an email to our team with everything filled in: just press send. We confirm by email or phone within one working day.';
  }

  /* ---------- validation ---------- */
  function check(id, ok) { const el = f(id)?.closest('.field'); if (!el) return true; el.classList.toggle('is-invalid', !ok); return ok; }
  function validate(step) {
    let ok = true;
    if (step === 1) {
      ok &= check('firstName', val('firstName').length > 1);
      ok &= check('lastName', val('lastName').length > 1);
      ok &= check('email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val('email')));
      ok &= check('phone', val('phone').replace(/\D/g, '').length >= 9);
    }
    if (step === 2 && state.delivery === 'deliver') {
      ok &= check('address1', val('address1').length > 3);
      ok &= check('town', val('town').length > 1);
      ok &= check('county', !!val('county'));
      ok &= check('eircode', val('eircode').replace(/\s/g, '').length >= 7);
    }
    if (step === 4) ok &= check('agree', f('agree').checked);
    return !!ok;
  }

  function go(step) {
    state.step = step;
    qsa('.step-panel').forEach(p => p.classList.toggle('is-active', +p.dataset.panel === step));
    qsa('#steps span').forEach(s => { const n = +s.dataset.step; s.classList.toggle('is-active', n === step); s.classList.toggle('is-done', n < step); });
    if (step === 3) renderPayment();
    if (step === 4) renderReview();
    renderSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- submit ---------- */
  function orderRef() { const d = new Date(); return 'CI-' + d.getFullYear().toString().slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(); }

  function buildOrder() {
    const items = CART.load().map(l => { const p = CART.product(l.id); return { id: l.id, name: p.name, qty: l.qty, unit: l.unit, options: l.options, line: l.qty * l.unit }; });
    return {
      ref: orderRef(), placedAt: new Date().toISOString(),
      customer: { firstName: val('firstName'), lastName: val('lastName'), email: val('email'), phone: val('phone') },
      delivery: { method: state.delivery, fee: deliveryFee(), address: state.delivery === 'deliver' ? { line1: val('address1'), line2: val('address2'), town: val('town'), county: val('county'), eircode: val('eircode') } : null, notes: val('notes') },
      payment: { method: state.payment, hummTerm: state.payment === 'humm' ? state.hummTerm : null, hummCode: state.payment === 'humm' ? val('hummCode') : null },
      items, subtotal: CART.subtotal(), total: total(), currency: S.currency.code
    };
  }

  function orderText(o) {
    const lines = [
      `NEW ORDER ${o.ref}`, `Placed: ${new Date(o.placedAt).toLocaleString('en-IE')}`, '',
      `Customer: ${o.customer.firstName} ${o.customer.lastName}`, `Email: ${o.customer.email}`, `Phone: ${o.customer.phone}`, '',
      `Delivery: ${o.delivery.method === 'collect' ? 'Collect from showroom' : 'Home delivery'}`,
      o.delivery.address ? `Address: ${[o.delivery.address.line1, o.delivery.address.line2, o.delivery.address.town, o.delivery.address.county, o.delivery.address.eircode].filter(Boolean).join(', ')}` : '',
      o.delivery.notes ? `Notes: ${o.delivery.notes}` : '', '',
      `Payment: ${o.payment.method}${o.payment.hummTerm ? ` (humm, ${o.payment.hummTerm} months)` : ''}${o.payment.hummCode ? ` — humm acceptance code ${o.payment.hummCode}` : ''}`, '',
      'Items:', ...o.items.map(i => `  ${i.qty} × ${i.name}${Object.keys(i.options || {}).length ? ' [' + Object.entries(i.options).map(([k, v]) => `${k}: ${v}`).join(', ') + ']' : ''} @ ${money(i.unit)} = ${money(i.line)}`), '',
      `Subtotal: ${money(o.subtotal)}`, `Delivery: ${money(o.delivery.fee)}`, `TOTAL: ${money(o.total)}`
    ];
    return lines.filter(l => l !== undefined).join('\n');
  }

  async function submit(e) {
    e.preventDefault();
    if (!validate(4)) return;
    const btn = f('placeOrder'); btn.disabled = true; btn.textContent = 'Placing order…';
    const order = buildOrder();
    const text = orderText(order);
    try { localStorage.setItem('ci_last_order', JSON.stringify(order)); } catch {}
    let sent = false;
    if (S.orders.endpoint) {
      try {
        const r = await fetch(S.orders.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ subject: `New order ${order.ref}`, order, summary: text, _replyto: order.customer.email }) });
        sent = r.ok;
      } catch { sent = false; }
    }
    if (!sent) {
      // Fallback: pre-filled email from the customer's own mail client
      const mail = `mailto:${S.orders.orderEmail}?subject=${encodeURIComponent('Order ' + order.ref + ' — ' + order.customer.firstName + ' ' + order.customer.lastName)}&body=${encodeURIComponent(text)}`;
      window.location.href = mail;
    }
    CART.clear();
    if (state.payment === 'humm' && H.mode === 'redirect' && H.checkoutUrl) {
      const u = new URL(H.checkoutUrl); u.searchParams.set('amount', order.total.toFixed(2)); u.searchParams.set('ref', order.ref);
      setTimeout(() => { window.location.href = u.toString(); }, 600);
      return;
    }
    setTimeout(() => { window.location.href = `order-complete.html?ref=${order.ref}&sent=${sent ? 1 : 0}`; }, sent ? 200 : 1200);
  }

  document.addEventListener('site:ready', () => {
    if (!CART.count()) { window.location.replace('cart.html'); return; }
    f('county').innerHTML = '<option value="">Choose…</option>' + COUNTIES.map(c => `<option ${c === 'Kildare' ? 'selected' : ''}>${c}</option>`).join('');
    renderDelivery(); renderSummary();
    f('county').addEventListener('change', () => { renderDelivery(); renderSummary(); });
    qsa('[data-next]').forEach(b => b.addEventListener('click', () => { if (validate(state.step)) go(+b.dataset.next); }));
    qsa('[data-prev]').forEach(b => b.addEventListener('click', () => go(+b.dataset.prev)));
    f('checkoutForm').addEventListener('submit', submit);
    qsa('.field input, .field select').forEach(i => i.addEventListener('input', () => i.closest('.field').classList.remove('is-invalid')));
  });
})();
