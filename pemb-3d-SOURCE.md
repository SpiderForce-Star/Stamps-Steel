# 3D PEMB player — source of truth

**Do not treat this folder as the primary 3D codebase.**

| Role | Repo / file |
|------|-------------|
| **Source of truth (edit here)** | [SpiderForce-Star/Isometric-PEMB-Video-Build](https://github.com/SpiderForce-Star/Isometric-PEMB-Video-Build) — React/R3F app + standalone `index.html` / `embed.html` |
| **Published player on this site** | `pemb-3d.html` (copy of the video-repo standalone for GitHub Pages) |
| **Host page** | `erection.html` → section `#pemb-3d` iframes `pemb-3d.html` |

## Why a copy?

The 3D coding lives in a **separate repo** so website HTML work and 3D iteration stay independent.  
GitHub Pages is already enabled on **Stamps-Steel**; enabling Pages on the video repo may require a one-time Settings click by the account owner. Until then (and for same-origin reliability), the static Three.js player is mirrored here.

## Update workflow

1. Change 3D code in `Isometric-PEMB-Video-Build` (prefer `index.html` / `embed.html` for the Pages player, or the React app for full tooling).
2. Copy the updated standalone file into this repo as `pemb-3d.html`.
3. Commit & push Stamps-Steel so the erection page picks up the new player.

Live page: https://SpiderForce-Star.github.io/Stamps-Steel/erection.html#pemb-3d  
Fullscreen player: https://SpiderForce-Star.github.io/Stamps-Steel/pemb-3d.html  
