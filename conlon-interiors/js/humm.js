/* =========================================================================
   Conlon Interiors — humm helpers
   -------------------------------------------------------------------------
   Two modes:
   1. Live widget: when SITE.humm.merchantId is set, the official humm pricing
      widget script is injected under the product price (per humm's docs).
   2. Illustrative calculator: until then, instalments are estimated from
      SITE.humm.illustrativeTerms and clearly labelled as illustrative.
   ========================================================================= */
(function () {
  const H = window.SITE.humm;

  function eligible(amount) {
    return amount >= H.minAmount && amount <= H.maxAmount;
  }

  /* Illustrative monthly figure. For interest-bearing plans we use a simple
     annuity formula with the APR as nominal rate: close enough for an
     illustration; the live widget/humm application gives the exact figure. */
  function monthly(amount, term) {
    const t = H.illustrativeTerms.find(x => x.months === term) || H.illustrativeTerms[0];
    if (t.interestFree) return amount / t.months;
    const r = (t.apr / 100) / 12;
    return amount * r / (1 - Math.pow(1 + r, -t.months));
  }

  function fromLine(amount) {
    if (!eligible(amount)) return '';
    const m = monthly(amount, H.defaultTerm);
    return `<span class="humm-line"><span class="humm-tag">humm</span> from <strong>${money(m)}</strong>/month*</span>`;
  }

  function plansHtml(amount, activeTerm) {
    return H.illustrativeTerms.map(t => {
      const m = monthly(amount, t.months);
      const label = t.interestFree ? '0% interest' : `${t.apr}% APR representative`;
      return `<div class="humm-plan ${t.months === activeTerm ? 'is-active' : ''}" data-term="${t.months}">
        <span>${t.months} monthly payments · ${label}</span><strong>${money(m)}<small style="font-weight:400;color:var(--muted)">/mo</small></strong>
      </div>`;
    }).join('');
  }

  /* Full calculator box for product and cart pages */
  function box(amount, opts = {}) {
    if (!eligible(amount)) {
      if (amount < H.minAmount) return `<div class="humm-box"><div class="humm-box__head"><span class="humm-logo">humm</span><strong>Spread the cost</strong></div><p style="font-size:.9rem;color:var(--steel);margin:0">humm is available on baskets from ${money0(H.minAmount)}. Add another item to qualify.</p></div>`;
      return `<div class="humm-box"><div class="humm-box__head"><span class="humm-logo">humm</span><strong>Spread the cost</strong></div><p style="font-size:.9rem;color:var(--steel);margin:0">humm finances purchases up to ${money0(H.maxAmount)}. Talk to us about larger projects.</p></div>`;
    }
    const live = !!H.merchantId;
    return `
      <div class="humm-box" data-humm-amount="${amount}">
        <div class="humm-box__head">
          <span><span class="humm-logo">humm</span>&nbsp; <strong>Spread the cost, up to ${money0(H.maxAmount)}</strong></span>
          <a href="finance.html" style="font-size:.8rem;text-decoration:underline">How it works</a>
        </div>
        ${live ? `<div class="humm-live"></div>` : `
        <p style="font-size:.88rem;color:var(--steel);margin:0 0 6px">Choose a plan to see an illustrative monthly payment for ${money(amount)}:</p>
        <div class="humm-plans">${plansHtml(amount, H.defaultTerm)}</div>`}
        <div class="humm-warning">${H.legal.warning}</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin:12px 0 10px">
          <a class="btn btn--ember btn--sm" href="${H.applyUrl}" target="_blank" rel="noopener">Get pre-approved with humm</a>
          ${opts.checkout ? '' : '<a class="btn btn--ghost btn--sm" href="finance.html">Learn more</a>'}
        </div>
        <p class="humm-legal">${live ? '' : '*Illustrative figures only, assuming the plans listed. '}${H.legal.disclaimer} ${H.legal.regulated}</p>
      </div>`;
  }

  function bind(container) {
    qsa('.humm-plan', container).forEach(p => p.addEventListener('click', () => {
      qsa('.humm-plan', container).forEach(x => x.classList.remove('is-active'));
      p.classList.add('is-active');
    }));
    // Inject official widget when the merchant ID is configured.
    const live = qs('.humm-live', container);
    if (live && H.merchantId) {
      const amount = container.querySelector('[data-humm-amount]')?.dataset.hummAmount || qs('[data-humm-amount]', container)?.dataset.hummAmount;
      const s = document.createElement('script');
      s.src = `${H.widgetScript}?id=${encodeURIComponent(H.merchantId)}&productPrice=${encodeURIComponent(amount)}`;
      live.appendChild(s);
    }
  }

  window.HUMM = { eligible, monthly, fromLine, box, bind, plansHtml };
})();
