# CLEAR-DST

A cultural diagnostic tool for construction project organisations, built as part of doctoral research at University College Dublin.

The site is a static, framework-free build (same design system as the InfraBid site: vanilla HTML/CSS/JS, no build step) that:

- Explains the **LEAR framework** — Leadership, Environment, Architecture, Resources — the four dimensions the CLEAR-DST survey measures.
- Runs the full **36-item Section 1 survey** (9 items per LEAR dimension, 1–5 Likert scale) plus the **13-item Section 2 background & departure module**, transcribed from `CLEARDST_Full_Survey.xlsx`.
- Generates a **bespoke report** entirely client-side (no backend, no data leaves the browser): dimension scores banded RED/AMBER/GREEN, the five lowest-scoring indicators each paired with a specific recommended intervention, and — where departure/turnover data is given — insight cards linking culture directly to workforce cost (attribution, secondary drivers, knowledge-loss amplification, disengagement window, vacancy/ramp-up exposure).

## Structure

- `index.html` — landing page
- `about.html` — LEAR framework & methodology
- `survey.html` / `survey.js` — the survey instrument (multi-step, saves progress to `localStorage`)
- `report.html` / `report.js` — the bespoke report, reads from `localStorage`
- `survey-data.js` — the question bank, dimension metadata, intervention library and scoring logic (`window.CLEARDST`)
- `style.css` / `app.js` — shared design system and page behaviour (nav, scroll reveal, particle background)
- `assets/` — logo

## Running locally

No build step — just serve the directory statically, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.
