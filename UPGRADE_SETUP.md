# One World Steel site upgrade — setup steps

## 1. Formspree (required for form delivery)
1. Create a free account at https://formspree.io
2. Create a form that emails **info@oneworldsteel.com**
3. Copy the form endpoint (e.g. `https://formspree.io/f/xxxxxxxx`)
4. Open `js/quote-form.js` and replace:

```js
var FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
```

Until configured, the multi-step form still opens a **mailto:** fallback and shows the success UI.

Optional: Web3Forms or Static Forms work the same pattern if you prefer — swap the fetch URL and field names in `js/quote-form.js`.

## 2. Custom domain oneworldsteel.com (do not flip yet)
1. Keep the repo `CNAME` file as `stampssteel.com` until `oneworldsteel.com` is registered and pointed.
2. Site copy, canonicals, Open Graph, schema, and sitemap already say `https://oneworldsteel.com/`.
3. When the new domain is ready: update DNS, then change `CNAME` and GitHub Pages custom domain together.

## 3. Google reviews badge
In homepage testimonials section, replace the TODO comment with your Google Business Profile badge/embed.

## 4. Replace placeholder testimonials
Search for `Placeholder testimonial` and swap in real quotes when available.
