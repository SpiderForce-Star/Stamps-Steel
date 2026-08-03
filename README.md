# Stamps Steel Buildings Website

Modern, visual, locally focused website for **Stamps Steel Buildings** — a private-label / broker of pre-engineered metal buildings (PEBs) based in **Bethpage, Middle Tennessee**, serving customers **nationwide**.

**Live site:** [https://SpiderForce-Star.github.io/Stamps-Steel/](https://SpiderForce-Star.github.io/Stamps-Steel/)

---

## Contact

| | |
|---|---|
| **Phone** | [(615) 629-8217](tel:+16156298217) |
| **Email** | [info@stampssteel.com](mailto:info@stampssteel.com) |
| **Facebook** | [Stamps Steel](https://www.facebook.com/profile.php?id=61592282766064) |
| **Instagram** | [@stampssteel](https://www.instagram.com/stampssteel/) |
| **Location** | Bethpage, TN 37022 · Middle Tennessee |

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Home — hero video, Why Us, Solutions, Projects, Process, Panels teaser, Accessories teaser, About, Free Quote, footer |
| `accessories.html` | Product catalog — filters, 14 accessories, 3D placeholders, quote form |
| `panels.html` | Panel types & colors — **real manufacturer profile photos**, data sheets, 3D panel views, color palette |
| `about.html` | Full About Us — experience, capabilities, building types, systems (owner copy) |
| `insulation.html` | Metal building insulation — common 3/4/6″ PSK-VR first, then high-R multi-layer |
| `imp.html` | Insulated metal panels — thicknesses, R-values, profiles, standing seam, finishes |
| `designer.html` | Build Your Own Building — embeds Stamps Steel 3D designer portal |
| `erection.html` | Professional steel erection on slab/piers — MBMA-informed process, 8-stage walkthrough, interactive **50×100×16** gable visual |
| `images/panels/` | Cached profile images + PDF data sheets for offline/GitHub Pages display |

**Stack:** Pure HTML + Tailwind CDN · no build step · mobile-first · GitHub Pages

---

## Branding

- **Steel:** `#0f172a` (dark slate / industrial)
- **Copper CTAs:** `#c97b3a` / `#b87333`
- **Logo:** `images/logo.jpg` — copper STAMPS over I-beam STEEL
- **Tone:** Professional, straightforward, no high-pressure language

### Core messaging

1. **Local Expertise** — Middle Tennessee codes, weather, conditions  
2. **Integrity** — Straight talk, no high-pressure tactics  
3. **Value Engineering** — Smart design that saves money  

---

## Accessories product assets (`images/`)

Product photos and sheets (no supplier names in public filenames):

```
ridge-vent-1.png / ridge-vent-2.png
low-profile-vent.png
cupola.png / cupola-specs.png
wall-louver.png / wall-louver-specs.png
wall-fan.png / wall-fan-specs.png
walk-door-canopy.png / walk-door-canopy-specs.png / walk-door-canopy-sizes.png
corner-canopy.png / corner-canopy-specs.png
rollup-door.png
electric-operator.png
roof-curb.png / roof-curb-specs.png
door-hardware.png
preassembled-door-specs.pdf
knockdown-door-specs.pdf
thermal-window-specs.pdf
```

Walk doors and thermal windows currently use **PDF product sheets** (photos TBD).  
**3D View** buttons are non-interactive placeholders (“Coming Soon”).  
Click product photos to open a multi-image lightbox when extra views/specs exist.

---

## Local preview

Open `index.html` or `accessories.html` in a browser, or serve the folder:

```bash
# optional
npx serve .
```

---

## Deploy

GitHub Pages is enabled from `main`. After push, hard-refresh the live site if needed (1–3 minutes).

---

## Future ideas

- Formspree / Netlify Forms for reliable form delivery  
- Custom domain (e.g. stampssteel.com)  
- Product photos + optional multi-image lightbox  
- Simple size estimator or 3D configurator  

---

© 2026 Stamps Steel Buildings · Bethpage, TN

## Credits

Website built by [Webb Spinner Visions](https://webbspinnervisions.net).
