/* =========================================================================
   Conlon Interiors — product catalogue
   -------------------------------------------------------------------------
   Prices are PLACEHOLDERS for launch review: replace with the shop's real
   prices. Images come from the Conlon Interiors Facebook gallery.
   Each product:
     id, name, category, price (EUR, VAT inc), img (base filename without
     extension in assets/img), images[], short, description, specs[],
     options {label: [values]}, type: 'stock' | 'bespoke' | 'per-m2',
     badge (optional), lead (delivery lead time), featured (bool)
   ========================================================================= */
window.CATALOGUE = {
  categories: [
    { id: 'sofas',     name: 'Sofas & Recliners', blurb: 'Deep-seated comfort, built to last.' },
    { id: 'beds',      name: 'Beds & Mattresses', blurb: 'Frames and pocket-sprung mattresses in every size.' },
    { id: 'dining',    name: 'Dining',            blurb: 'Tables and chairs for every kitchen.' },
    { id: 'doors',     name: 'Internal Doors',    blurb: 'Shaker, glazed, oak and black-framed styles, supplied or fitted.' },
    { id: 'flooring',  name: 'Flooring',          blurb: 'Herringbone, wide plank, LVT and stair carpet, priced per square metre.' },
    { id: 'bespoke',   name: 'Bespoke Carpentry', blurb: 'Media walls, alcove units, wardrobes and panelling, made to measure.' }
  ],

  products: [
    /* ---------------- Sofas ---------------- */
    {
      id: 'hudson-3-seater-recliner', name: 'Hudson 3-Seater Electric Recliner', category: 'sofas',
      price: 1499, img: 'sofa-recliner-1', images: ['sofa-recliner-1', 'sofa-recliner-3', 'sofa-recliner-4'],
      short: 'Power recline with drop-down centre console and cup holders.',
      description: 'A generous three-seat recliner in soft, distressed-effect fabric. Each end seat reclines at the touch of a button and the centre back folds forward into a console with twin cup holders. Hardwood frame, sprung seat base and high-resilience foam cushions throughout.',
      specs: ['Width 225 cm · Depth 98 cm · Height 102 cm', 'Hardwood frame, 10-year frame guarantee', 'Power recline, USB charging in both arms', 'Fabric: slate grey, charcoal or taupe'],
      options: { Colour: ['Slate Grey', 'Charcoal', 'Taupe'] },
      type: 'stock', lead: '2–4 weeks', featured: true, badge: 'Best seller'
    },
    {
      id: 'hudson-corner-recliner', name: 'Hudson Corner Recliner Suite', category: 'sofas',
      price: 2199, img: 'sofa-recliner-2', images: ['sofa-recliner-2', 'sofa-recliner-5', 'sofa-recliner-4'],
      short: 'Six-seat corner group with two electric recliners.',
      description: 'The full Hudson corner group: a left- or right-hand chaise with two power recliners, deep seats and padded headrests. Designed for family rooms and the Sunday match alike.',
      specs: ['Corner 290 × 245 cm', 'Left- or right-hand facing', 'Two electric recliners, USB ports', 'Fabric: slate grey or charcoal'],
      options: { Orientation: ['Left-hand facing', 'Right-hand facing'], Colour: ['Slate Grey', 'Charcoal'] },
      type: 'stock', lead: '3–5 weeks', featured: true
    },
    {
      id: 'hudson-armchair-recliner', name: 'Hudson Recliner Armchair', category: 'sofas',
      price: 799, img: 'armchair-recliner', images: ['armchair-recliner', 'sofa-recliner-3'],
      short: 'Matching single power recliner.',
      description: 'The armchair from the Hudson range. Power recline, padded headrest and the same hardwood frame and high-resilience foam as the sofas.',
      specs: ['Width 102 cm · Depth 98 cm · Height 102 cm', 'Power recline with USB port', 'Fabric: slate grey, charcoal or taupe'],
      options: { Colour: ['Slate Grey', 'Charcoal', 'Taupe'] },
      type: 'stock', lead: '2–4 weeks'
    },

    /* ---------------- Beds ---------------- */
    {
      id: 'kildare-upholstered-bed', name: 'Kildare Upholstered Bed Frame', category: 'beds',
      price: 649, img: 'bed-1', images: ['bed-1'],
      short: 'Tall padded headboard, solid slatted base.',
      description: 'A tall, softly padded headboard in a linen-look fabric on a solid slatted base. Supplied flat-packed or assembled in your room by our team.',
      specs: ['Available in 4ft6 double, 5ft king and 6ft super king', 'Solid sprung slats', 'Fabric: oatmeal, grey or navy'],
      options: { Size: ['Double (4ft6)', 'King (5ft)', 'Super King (6ft)'], Fabric: ['Oatmeal', 'Grey', 'Navy'] },
      type: 'stock', lead: '2–3 weeks', featured: true
    },
    {
      id: 'pocket-sprung-mattress', name: 'Newbridge 2000 Pocket Sprung Mattress', category: 'beds',
      price: 549, img: 'mattress-1', images: ['mattress-1'],
      short: '2,000 individually nested pocket springs, medium-firm.',
      description: 'Two thousand individually nested pocket springs with a natural fibre comfort layer and a quilted knitted cover. Medium-firm support that suits most sleepers.',
      specs: ['Depth 27 cm', 'Medium-firm', 'Hypoallergenic fillings', '5-year guarantee'],
      options: { Size: ['Single (3ft)', 'Double (4ft6)', 'King (5ft)', 'Super King (6ft)'] },
      type: 'stock', lead: '1–2 weeks'
    },

    /* ---------------- Dining ---------------- */
    {
      id: 'round-dining-set', name: 'Liffey Round Dining Table & 4 Chairs', category: 'dining',
      price: 899, img: 'dining-1', images: ['dining-1'],
      short: 'Marble-effect top on a black pedestal, four upholstered chairs.',
      description: 'A 110 cm round marble-effect table on a sculpted black pedestal base, paired with four upholstered dining chairs with black metal legs. Seats four comfortably.',
      specs: ['Table Ø 110 cm · Height 76 cm', 'Sintered stone-effect top', 'Chairs: grey or cream upholstery'],
      options: { Chairs: ['Grey', 'Cream'] },
      type: 'stock', lead: '2–4 weeks'
    },

    /* ---------------- Doors ---------------- */
    {
      id: 'shaker-4-panel-door', name: 'Shaker 4-Panel Internal Door', category: 'doors',
      price: 189, img: 'door-shaker-1', images: ['door-shaker-1', 'door-shaker-2', 'door-white-3'],
      short: 'Primed white, ready to paint. Supplied or fitted.',
      description: 'Our most popular door. A classic four-panel shaker profile, pre-primed and ready to paint in any colour. Fitting, ironmongery and frames can be added below.',
      specs: ['Standard heights 78" and 80"', 'Widths 24", 27", 30", 33"', 'Primed white, paint-ready', 'Fitting from €95 per door'],
      options: { Width: ['24"', '27"', '30"', '33"'], Fitting: ['Supply only', 'Supply & fit (+€95)'] },
      type: 'stock', lead: '1–2 weeks', featured: true
    },
    {
      id: 'frosted-glazed-door', name: 'Frosted 4-Light Glazed Door', category: 'doors',
      price: 259, img: 'door-glazed-1', images: ['door-glazed-1', 'door-glazed-2', 'door-glazed-3'],
      short: 'Four frosted panes for privacy with light.',
      description: 'A shaker-style door with four obscure-glazed panes. Lets light through hallways and kitchens without losing privacy. Available as a single door or a pair of doubles.',
      specs: ['Toughened obscure glass', 'Primed white', 'Single or double configuration'],
      options: { Configuration: ['Single door', 'Double doors (+€259)'], Fitting: ['Supply only', 'Supply & fit (+€95)'] },
      type: 'stock', lead: '1–2 weeks'
    },
    {
      id: 'oak-veneer-door', name: 'Oak Veneer Internal Door', category: 'doors',
      price: 229, img: 'door-oak-1', images: ['door-oak-1', 'door-oak-2'],
      short: 'Pre-finished real oak veneer, no painting needed.',
      description: 'A warm, pre-finished real oak veneer door with a subtle horizontal groove detail. No painting required, straight out of the box.',
      specs: ['Pre-finished oak veneer', 'Solid core', 'Standard heights 78" and 80"'],
      options: { Width: ['27"', '30"', '33"'], Fitting: ['Supply only', 'Supply & fit (+€95)'] },
      type: 'stock', lead: '1–2 weeks'
    },
    {
      id: 'black-industrial-glazed-door', name: 'Black Industrial Glazed Door', category: 'doors',
      price: 449, img: 'door-black-glazed-1', images: ['door-black-glazed-1', 'door-black-glazed-2', 'door-black-glazed-3', 'door-black-glazed-4'],
      short: 'Crittall-style black frame with clear or frosted glass.',
      description: 'The industrial look: a slim black frame with three or four horizontal glazing bars. Clear glass for living spaces, frosted for bathrooms and utility rooms. Also available as double doors and room dividers.',
      specs: ['Toughened safety glass', 'Powder-coated black finish', 'Single, double or fixed-screen configurations'],
      options: { Glass: ['Clear', 'Frosted'], Configuration: ['Single door', 'Double doors (+€449)'], Fitting: ['Supply only', 'Supply & fit (+€120)'] },
      type: 'stock', lead: '2–3 weeks', featured: true, badge: 'New'
    },

    /* ---------------- Flooring ---------------- */
    {
      id: 'herringbone-laminate', name: 'Herringbone Laminate Flooring', category: 'flooring',
      price: 34.95, unit: 'per m²', img: 'floor-herringbone-1', images: ['floor-herringbone-1', 'floor-herringbone-2', 'floor-herringbone-4', 'floor-herringbone-5'],
      short: 'Classic parquet look, hard-wearing AC4 laminate.',
      description: 'Herringbone laminate in warm oak and light grey tones. AC4 rated for busy family rooms and hallways, with a click-fit system. Fitting, underlay and trims quoted on request.',
      specs: ['12 mm, AC4 wear rating', 'Click-fit, waterproof core option', 'Sold per m²; order in whole m² plus 10% for cutting'],
      options: { Tone: ['Natural Oak', 'Light Grey', 'Smoked Oak'] },
      type: 'per-m2', lead: 'In stock', featured: true
    },
    {
      id: 'wide-plank-laminate', name: 'Wide Plank Laminate Flooring', category: 'flooring',
      price: 24.95, unit: 'per m²', img: 'floor-plank-1', images: ['floor-plank-1', 'floor-plank-2', 'floor-plank-3', 'floor-plank-4'],
      short: 'Long, wide boards for open-plan rooms.',
      description: 'Extra-wide, extra-long planks that make rooms feel bigger. Available in natural, grey and honey oak finishes.',
      specs: ['8 mm, AC4 wear rating', 'Bevelled edges', 'Sold per m²'],
      options: { Tone: ['Natural Oak', 'Grey Oak', 'Honey Oak'] },
      type: 'per-m2', lead: 'In stock'
    },
    {
      id: 'lvt-herringbone', name: 'Luxury Vinyl Tile — Herringbone', category: 'flooring',
      price: 49.95, unit: 'per m²', img: 'floor-herringbone-3', images: ['floor-herringbone-3', 'floor-herringbone-6', 'floor-herringbone-7'],
      short: 'Fully waterproof, warm underfoot.',
      description: 'Herringbone LVT for kitchens, bathrooms and utility rooms. Completely waterproof, quiet and warm underfoot, and suitable over underfloor heating.',
      specs: ['Waterproof rigid core', 'Suitable over underfloor heating', 'Sold per m²'],
      options: { Tone: ['Pale Oak', 'Natural Oak', 'Warm Grey'] },
      type: 'per-m2', lead: '1 week'
    },
    {
      id: 'stair-carpet-runner', name: 'Stair Carpet, Fitted', category: 'flooring',
      price: 39, unit: 'per step', img: 'stairs-carpet-1', images: ['stairs-carpet-1', 'stairs-carpet-2', 'stairs-carpet-5', 'stairs-carpet-6'],
      short: 'Supplied and fitted, with painted-edge or runner styles.',
      description: 'Hard-wearing stair carpet, fitted by our own team. Choose a full-width fit or a runner with painted edges, with a stair rod option for the finishing touch.',
      specs: ['Priced per step including fitting and underlay', 'Full width or runner style', 'Wide colour range in the showroom'],
      options: { Style: ['Full width', 'Runner with painted edges'] },
      type: 'per-m2', lead: '2 weeks'
    },

    /* ---------------- Bespoke (quote-based) ---------------- */
    {
      id: 'media-wall', name: 'Bespoke Media Wall', category: 'bespoke',
      price: 3500, from: true, img: 'hero-media-wall', images: ['hero-media-wall', 'media-wall-fire-1', 'media-wall-fire-5', 'media-wall-fire-7', 'media-wall-fire-9'],
      short: 'Made-to-measure media walls with electric fires, slat panelling and lighting.',
      description: 'Our signature piece. A fully built media wall designed around your room: recessed TV, inset electric fire, floating shelves with integrated lighting, slat panelling and painted base cabinets. We design it with you in the showroom, build it in our Newbridge workshop and fit it in your home.',
      specs: ['Design consultation in showroom or at home', 'Electric fire options from leading brands', 'Painted in any colour, slat panelling in oak or walnut', 'Typical build 3–6 weeks from survey'],
      type: 'bespoke', lead: '3–6 weeks', featured: true, badge: 'Signature'
    },
    {
      id: 'alcove-units', name: 'Alcove Units & Shelving', category: 'bespoke',
      price: 2800, from: true, img: 'alcove-units-1', images: ['alcove-units-1', 'alcove-units-2', 'alcove-units-3'],
      short: 'Shaker base cupboards with floating shelves either side of a chimney breast.',
      description: 'Classic alcove units: painted shaker cupboards below and floating shelves above, with LED lighting if you want it. Built to the millimetre around your chimney breast.',
      specs: ['Hand-painted in any colour', 'Soft-close doors', 'Optional LED shelf lighting'],
      type: 'bespoke', lead: '3–5 weeks'
    },
    {
      id: 'fitted-wardrobes', name: 'Fitted Wardrobes', category: 'bespoke',
      price: 2500, from: true, img: 'wardrobe-2', images: ['wardrobe-2', 'wardrobe-1', 'wardrobe-3', 'wardrobe-5', 'wardrobe-6'],
      short: 'Floor-to-ceiling wardrobes with fully fitted interiors.',
      description: 'Floor-to-ceiling fitted wardrobes that use every inch, including awkward sloped ceilings. Hanging rails, shelving, drawers and dressing-table sections, all configured to how you live.',
      specs: ['Shaker or flat-panel doors', 'Fitted interiors: rails, shelves, drawers', 'Painted or woodgrain finishes'],
      type: 'bespoke', lead: '3–5 weeks', featured: true
    },
    {
      id: 'wall-panelling', name: 'Wall Panelling', category: 'bespoke',
      price: 650, from: true, img: 'media-wall-fire-2', images: ['media-wall-fire-2', 'media-wall-slat-navy', 'media-wall-fire-1'],
      short: 'Slat, shaker and half-height panelling.',
      description: 'Acoustic slat panelling, traditional shaker panelling or half-height board-and-batten, fitted and finished by our carpenters.',
      specs: ['Oak, walnut and painted options', 'Priced per wall after survey'],
      type: 'bespoke', lead: '1–2 weeks'
    },
    {
      id: 'fitted-kitchen', name: 'Fitted Kitchens', category: 'bespoke',
      price: 6500, from: true, img: 'kitchen-1', images: ['kitchen-1', 'kitchen-2', 'kitchen-3'],
      short: 'Painted shaker kitchens, designed, supplied and fitted.',
      description: 'Painted shaker kitchens designed around how you cook, supplied with quartz or laminate worktops and fitted by our own team.',
      specs: ['Design and 3D plan included', 'Quartz or laminate worktops', 'Appliance packages available'],
      type: 'bespoke', lead: '6–8 weeks'
    },
    {
      id: 'decking', name: 'Composite Decking', category: 'bespoke',
      price: 1800, from: true, img: 'decking-1', images: ['decking-1', 'decking-2', 'decking-3'],
      short: 'Low-maintenance composite decking, supplied and fitted.',
      description: 'Composite decking that never needs staining. Supplied and fitted with hidden fixings and matching edging.',
      specs: ['Grey, oak and charcoal boards', 'Hidden fixings', '25-year board warranty'],
      type: 'bespoke', lead: '2–3 weeks'
    }
  ]
};
