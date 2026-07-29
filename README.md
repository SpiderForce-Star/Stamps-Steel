# Stamps Steel Buildings Website

Modern, responsive single-page website for **Stamps Steel Buildings** — a new pre-engineered metal building (PEB) private-label / broker company based in **Bethpage, Middle Tennessee**.

Designed to be cleaner, more visual, and more locally focused than competitors while delivering a similar high-quality platform experience (authorized by Brian Buck for a comparable approach, but original design and messaging).

**Live Site:** https://SpiderForce-Star.github.io/Stamps-Steel/

---

## Current Status (July 2026 Upgrade)

- Copper / bronze industrial branding matching the official STAMPS STEEL logo
- Sticky nav, full hero video support, trust bar
- Why Stamps Steel section (local expertise, integrity, value engineering, quality PEBs)
- Building Solutions (Shops/Garages, Commercial/Auto, Agricultural, Warehouses, Specialty)
- Projects gallery
- Transparent 4-step process
- Enhanced quote form with building type, size, and location fields
- LocalBusiness schema + strong SEO meta
- Mobile-first, pure HTML + Tailwind CDN (no build step)

---

## Critical Next Steps for Owner / Team

### 1. Upload Official Logo & Key Photos
In the GitHub repo → `images/` folder:

| File you have                      | Upload / rename as              | Purpose                          |
|------------------------------------|---------------------------------|----------------------------------|
| Official copper STAMPS STEEL logo  | `images/logo.png` (or .webp)    | Nav + footer branding            |
| CNJKw.jpg (white/black wood-soffit)| `images/hero.jpg`               | Hero fallback / signature shop   |
| Alabama Auto Customs.jpg           | `images/commercial.jpg`         | Commercial multi-bay example     |

After uploading, we can update the HTML in a follow-up commit to use the logo image and feature the new photos more prominently (currently the site uses existing gallery images + video).

### 2. Provide Real Contact Info
Open `index.html` and replace:
- `(615) XXX-XXXX` with the real phone number
- Confirm `info@stampssteel.com` or update the email
- Optionally switch the form from `mailto:` to a free Formspree endpoint for better submissions

### 3. GitHub Pages
Already enabled / deployed from `main`. Hard-refresh the live site if you still see the old version (propagation can take 1–3 minutes).

---

## Design Notes

- Colors: Dark slate + copper/bronze accents taken from the official logo
- Single-page for speed and modern UX (competitors are multi-page)
- Strong Middle Tennessee / Bethpage local messaging
- Private-label quality + transparent process positioning
- No high-pressure language; focuses on local knowledge and value engineering

## Future Ideas (Ask Grok)
- Swap in the new hero & commercial photos + logo image once uploaded
- Formspree or Netlify Forms for real form handling
- Additional gallery items from the AI mockups / rendered set
- Simple size estimator or 3D configurator mock
- Custom domain (stampssteel.com or similar)
- More detailed building-type sub-pages if desired

---

© 2026 Stamps Steel Buildings · Bethpage, TN  
Built for rapid launch and easy iteration.
