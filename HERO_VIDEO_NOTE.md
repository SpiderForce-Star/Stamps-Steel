# Hero Video

## Current (live)
- **File:** `images/hero/stamps-hero.mp4`
- **Codec:** H.264 Main, **yuv420p** (browser-safe), 1280×720, ~16s, muted loop
- **Poster:** `images/hero/poster.webp` (+ jpg/640w/960w)
- **Playback:** muted autoplay on all viewports except `prefers-reduced-motion` or Save-Data
- **Content:** copper logo entrance → building sequence → lower-right watermark → “Design Your Building” CTA

## 2026-08-09 fix
Previous encode was H.264 **High 4:4:4 / yuv444p**, which many browsers cannot decode — video never became visible. Re-encoded to yuv420p. Restored `poster.jpg` (was a 11-byte `PLACEHOLDER` from a failed replace). Enabled video on mobile (was desktop-only).

Cache-bust query: `?v=20260809-420`
