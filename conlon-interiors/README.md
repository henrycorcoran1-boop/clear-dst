# Conlon Interiors — website & brand suite

Premium static website with an online shop, basket and humm-ready checkout for **Conlon Interiors**, Unit 26C Newbridge Industrial Estate, Co. Kildare, plus a full logo and marketing suite.

No build step, no framework, no backend required: plain HTML, CSS and JavaScript. Upload the folder to any host (Netlify, Cloudflare Pages, Vercel, Blacknight, Hostinger, GitHub Pages) and it runs.

## What’s in the box

| Path | What it is |
|---|---|
| `index.html` | Home: hero, shop-by-room, signature media wall, featured products, humm, reviews, process |
| `shop.html` | Catalogue with category filters, search and sorting |
| `product.html?id=…` | Product page: gallery, options, quantity, humm calculator, related items |
| `services.html` | Bespoke carpentry (media walls, alcove units, wardrobes, panelling, kitchens, decking) |
| `gallery.html` | 85 photos from the Facebook page, filterable, with lightbox |
| `finance.html` | “Pay with humm” page: how it works, calculator, eligibility, fees, FAQ, humm partner iframe |
| `about.html`, `contact.html` | Story, showroom hours, map, enquiry form, WhatsApp |
| `cart.html`, `checkout.html`, `order-complete.html` | Basket (localStorage), 4-step checkout, confirmation |
| `delivery.html`, `terms.html`, `privacy.html`, `404.html` | Policies |
| `js/config.js` | **The only file you need to edit to go live** (contact details, humm, orders, delivery) |
| `js/catalogue.js` | Products, prices, options and photos |
| `assets/brand/` | 17 SVG logos (primary, wordmark, horizontal, mono, monogram, favicon) |
| `assets/img/` | 86 optimised photos (+ thumbnails) |
| `brand/` | Brand guidelines, social templates, business card, A5 flyer, A4 humm poster, email signature, launch copy |
| `brand/exports/` | PNG/PDF exports of everything above |

Open `brand/brand-guidelines.html` for the identity system and asset index.

## Run locally

```
cd conlon-interiors
python3 -m http.server 8000
```
Then open http://localhost:8000/ (the pages must be served over HTTP, not opened as `file://`, for the catalogue scripts to load).

## Go-live checklist

Everything below lives in `js/config.js`.

1. **Contact details** — confirm `email` (currently a placeholder `hello@conloninteriors.ie`), add Instagram if there is one.
2. **Prices** — every price in `js/catalogue.js` is a placeholder for review. Edit `price`, `options`, `specs`, `lead` and `badge` per product; add or remove products freely (copy a block). Flooring uses `type: 'per-m2'`, quote-only items use `type: 'bespoke'`.
3. **Orders** — set `orders.endpoint` to a form endpoint such as Formspree, Basin, Getform or Netlify Forms (a 5-minute sign-up; orders and enquiries then arrive by email as structured JSON). Until it is set, checkout opens the customer’s email app with the full order pre-filled, which still works but relies on the customer pressing send.
4. **humm** — see below.
5. **Domain & hosting** — upload the folder; set `404.html` as the not-found page; point `conloninteriors.ie` at it. Update the email signature logo URL in `brand/email-signature.html` once live.
6. **Google Business Profile** — paste the description from `brand/launch-copy.md`, upload `brand/exports/social/google-business-cover-1024x576.png` and the monogram as the logo.
7. **Facebook** — upload `brand/exports/social/fb-cover-1640x624.png` and `profile-picture-1080.png`.

## humm integration (Ireland)

humm (Flexifi Europe Limited, regulated by the Central Bank of Ireland) finances purchases from about €80 up to €30,000 for Irish retailers. The shop needs a **humm merchant account** first: apply at https://www.shophumm.com/ie/business/ or via humm merchant services. humm then issues the credentials below.

The site supports humm in two modes, both configured in `js/config.js → humm`:

| Setting | What to do |
|---|---|
| `merchantId` | Paste the humm widget/merchant ID. The official humm pricing widget (`flexifi-widget.js`) then loads under every product price with live, compliant instalment figures, replacing the illustrative calculator. |
| `mode: 'assisted'` (default) | Works from day one with no plugin. The customer gets pre-approved at apply.humm.ie, enters their **acceptance code** at checkout, and the shop completes the sale in the humm merchant portal exactly as it would in-store, then confirms the order. |
| `mode: 'redirect'` + `checkoutUrl` | For a hosted humm checkout. humm’s hosted online checkout in Ireland is delivered through their Shopify Payment App, WooCommerce or Magento plugins (Account ID, Client ID, Client Secret and Refresh Token from humm). If the shop later moves the catalogue to Shopify or WooCommerce, set the checkout URL here and the site redirects after the order is placed. |
| `illustrativeTerms` | Until the live widget is connected, these drive every “from €X/month” figure. Set them to the plans humm actually enables for the shop (e.g. 6/12 months 0%, 24 months at the agreed APR). |
| `minAmount` / `maxAmount` | Basket range eligible for humm. |
| `legal` | Mandatory warning and regulatory text. Shown on every finance mention, product page, checkout and the footer. Do not remove. |

humm docs used: pricing widget (https://docs.shophumm.com/docs/pricing-widget), widget API for Irish merchants (https://docs.shophumm.com/docs/widget-api-ie-documentation-irish-merchants), Shopify/WooCommerce guides, humm Ireland “How it works”, and the IE partner landing page (embedded on `finance.html`).

## Design system

- **Fonts:** Bebas Neue (brand/eyebrows), Cormorant Garamond (headlines), Inter (body), loaded from Google Fonts.
- **Colours:** Charcoal `#1F262E`, Ink `#14181D`, Ember `#F28A1F`, Oak `#C9A97A`, Linen `#F4EFE7`, Paper `#FAF7F2`.
- Logo faithfully rebuilt from the original showroom signage (charcoal field, ember bars, hammer, condensed white wordmark, three service columns) and extended with a wordmark, horizontal lockup, monogram and mono versions. All text in the SVGs is outlined, so no font dependency.

## Regenerating exports

Logo SVGs were generated with `fontTools` from the Bebas Neue outlines; PNG exports and the social/print PNG/PDFs were rendered with headless Chromium (Playwright). Templates are plain HTML in `brand/social/` and `brand/print/` and can be edited and re-rendered or screenshotted from any browser.
