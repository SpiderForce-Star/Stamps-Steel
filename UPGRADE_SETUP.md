# Stamps Steel site upgrade — setup steps

## 1. Formspree (required for form delivery)
1. Create a free account at https://formspree.io
2. Create a form that emails **info@stampssteel.com**
3. Copy the form endpoint (e.g. `https://formspree.io/f/xxxxxxxx`)
4. Open `js/quote-form.js` and replace:

```js
var FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
```

Until configured, the multi-step form still opens a **mailto:** fallback and shows the success UI.

Optional: Web3Forms or Static Forms work the same pattern if you prefer — swap the fetch URL and field names in `js/quote-form.js`.

## 2. Custom domain stampssteel.com
1. In GitHub repo → Settings → Pages → Custom domain: `stampssteel.com`
2. DNS: CNAME (or A records per GitHub docs) pointing to GitHub Pages
3. Canonicals, Open Graph, schema, and sitemap already use `https://stampssteel.com/`
4. Keep GitHub Pages URL working until DNS propagates

## 3. Google reviews badge
In homepage testimonials section, replace the TODO comment with your Google Business Profile badge/embed.

## 4. Replace placeholder testimonials
Search for `Placeholder testimonial` and swap in real quotes when available.
