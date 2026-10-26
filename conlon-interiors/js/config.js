/* =========================================================================
   Conlon Interiors — site configuration
   Edit this file only. Everything else reads from here.
   ========================================================================= */
window.SITE = {
  business: {
    name: 'Conlon Interiors',
    legalName: 'Conlon Interiors',
    tagline: 'Bespoke carpentry, furniture and flooring in Newbridge',
    phone: '+353 86 467 1576',
    phoneDisplay: '086 467 1576',
    whatsapp: '353864671576',
    email: 'hello@conloninteriors.ie',          // TODO: replace with the real inbox
    address: {
      line1: 'Unit 26C Newbridge Industrial Estate',
      town: 'Newbridge',
      county: 'Co. Kildare',
      eircode: 'W12 YE64',
      country: 'Ireland'
    },
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Unit+26C+Newbridge+Industrial+Estate+Newbridge+W12YE64',
    hours: [
      { days: 'Monday – Saturday', time: '9:00am – 5:00pm' },
      { days: 'Sundays & Bank Holiday Mondays', time: '11:00am – 4:00pm' }
    ],
    facebook: 'https://www.facebook.com/61558798016297/',
    instagram: '',                                // add when available
    rating: { score: '94%', count: 12, label: 'recommend on Facebook' },
    vatNote: 'All prices include VAT at 23%.'
  },

  /* ---------------------------------------------------------------------
     humm (Flexifi Europe Limited t/a humm) — Ireland
     ---------------------------------------------------------------------
     merchantId : the humm widget/merchant ID humm issues to the shop.
                  Leave blank until the humm account is live; the site then
                  shows an illustrative calculator instead of the live widget.
     mode       : 'assisted' — customer gets pre-approved at humm, places the
                               order here, and the shop completes the humm
                               sale with the customer's acceptance code.
                  'redirect' — customer is sent to a humm-hosted checkout
                               (needs the Shopify/WooCommerce plugin or
                               Account ID + Client credentials from humm).
     checkoutUrl: hosted checkout URL for 'redirect' mode (from humm).
  --------------------------------------------------------------------- */
  humm: {
    merchantId: '',
    mode: 'assisted',
    checkoutUrl: '',
    applyUrl: 'https://apply.humm.ie/s/',
    loginUrl: 'https://myaccount.humm.ie/s/login/',
    infoUrl: 'https://www.shophumm.com/ie/how-it-works/',
    eligibilityUrl: 'https://www.shophumm.com/ie/faqs/am-i-eligible-for-humm/',
    partnerPageUrl: 'https://cdn.shophumm.com/humm/partners/ie/index.html',
    widgetScript: 'https://d3v2ir16k1una.cloudfront.net/content/scripts/flexifi-widget.js',
    minAmount: 80,          // smallest basket humm will finance here (confirm with humm)
    maxAmount: 30000,       // humm Ireland ceiling
    /* Illustrative plans shown before the live widget is connected.
       Set to the plans humm actually enables for the shop. */
    illustrativeTerms: [
      { months: 6,  interestFree: true },
      { months: 12, interestFree: true },
      { months: 24, interestFree: false, apr: 14.9 }
    ],
    defaultTerm: 12,
    legal: {
      warning: 'Warning: if you do not meet the repayments on your loan, your account will go into arrears. This may affect your credit rating, which may limit your ability to access credit in the future.',
      regulated: 'Flexifi Europe Limited, trading as humm, is regulated by the Central Bank of Ireland. Registered in Ireland, number 600124. Registered office: Level 4, No. 5 Custom House Plaza, Harbourmaster Place, Dublin 1.',
      disclaimer: 'Finance is subject to status and approval by humm. Rates, fees and terms vary by plan and are confirmed by humm during application. Conlon Interiors acts as a credit intermediary and does not provide credit itself.'
    }
  },

  /* ---------------------------------------------------------------------
     Orders: where checkout sends the order.
     endpoint  : an HTTPS form endpoint (Formspree, Basin, Netlify Forms,
                 Getform, or your own API). Leave blank to fall back to a
                 pre-filled email from the customer's mail app.
  --------------------------------------------------------------------- */
  orders: {
    endpoint: '',
    orderEmail: 'hello@conloninteriors.ie'
  },

  delivery: {
    localCounties: ['Kildare', 'Dublin', 'Meath', 'Wicklow', 'Laois', 'Offaly', 'Carlow'],
    localFee: 49,
    nationalFee: 89,
    freeOver: 1500,
    collectionNote: 'Free collection from our Newbridge showroom.'
  },

  currency: { code: 'EUR', symbol: '€', locale: 'en-IE' }
};
