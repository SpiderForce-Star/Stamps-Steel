import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const files = [
  'images/framing/components-overview.svg',
  'images/framing/frame-types.svg',
  'images/framing/girts-purlins.svg',
  'images/framing/framed-openings.svg',
  'images/insulation/diagram-single-layer.svg',
  'images/insulation/diagram-high-r.svg',
  'images/imp/profiles.svg',
  'images/imp/thickness-r.svg',
  'images/mini-storage/system-diagram.svg',
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1400 } });

for (const f of files) {
  const abs = path.join('/workspace/site', f);
  const svg = fs.readFileSync(abs, 'utf8');
  const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 960 620';
  const parts = vb.trim().split(/[\s,]+/).map(Number);
  const w = parts[2] || 960;
  const h = parts[3] || 620;
  // Scale up for retina
  const scale = 2;
  const W = Math.round(w * scale);
  const H = Math.round(h * scale);
  const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  await page.setViewportSize({ width: W + 20, height: H + 20 });
  await page.setContent(`<!DOCTYPE html><html><head><style>
    html,body{margin:0;padding:0;background:#ffffff;}
    img{display:block;width:${W}px;height:${H}px;}
  </style></head><body><img id="i" src="${dataUrl}" width="${W}" height="${H}"/></body></html>`);
  await page.waitForTimeout(200);
  const nw = await page.$eval('#i', (e) => e.naturalWidth);
  console.log(f, 'natural', nw, 'target', W, H);
  const outPng = abs.replace(/\.svg$/i, '.png');
  if (nw > 0) {
    await page.locator('#i').screenshot({ path: outPng, omitBackground: false });
    console.log('  png', outPng, fs.statSync(outPng).size);
  } else {
    // fallback: full page
    await page.screenshot({ path: outPng, clip: { x: 0, y: 0, width: W, height: H } });
    console.log('  png fallback', outPng, fs.statSync(outPng).size);
  }
}

await browser.close();
