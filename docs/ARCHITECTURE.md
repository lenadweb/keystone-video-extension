# Architecture

Keystone has three runtime contexts: a React popup, a Manifest V3 service worker and an isolated content script in each accessible frame. Settings in `chrome.storage.local` are their shared source of truth.

## Geometry and settings

`src/shared/keystone.ts` maps a rectangle to a quadrilateral using a homography, then scales the normalized transform into CSS pixel coordinates. Positive vertical values narrow the top; negative values narrow the bottom. Positive horizontal values narrow the right; negative values narrow the left. Values are clamped to ±20% and rounded to hundredths. Matrix coefficients retain twelve decimal places to avoid visible error at large video sizes.

The CSS matrix expects `transform-origin: 0 0`. A neutral transform returns `null`, allowing the original styles to be restored. Tilt estimates assume a 16:9 image and 1.2:1 throw ratio.

`settings.ts` validates untrusted stored values and exposes load/save/subscription functions. `commandSettings.ts` is the pure command reducer. The worker serializes command events so held keys do not race through storage reads and writes.

## Content lifecycle

- `index.ts` guards against duplicate injection by comparing the installed version and disposes an older instance.
- `runtime.ts` owns settings subscriptions, visible-video membership, batched updates, resize/style observers, fullscreen retries and disposal.
- `discovery.ts` discovers videos in the document and open shadow roots, then tracks inserted and removed subtrees. Reparented connected videos remain registered.
- `videoStyles.ts` owns per-video style backups and reversible application. It writes only differing properties to prevent a mutation feedback loop. When the page replaces a controlled style, the new page-owned value becomes the restoration target.
- `osd.ts` renders keyboard feedback in a shadow-root popover. `summary.ts` formats its readout.

Disposal disconnects observers and listeners, cancels timers, restores video styles and removes the overlay. Content scripts do not fetch resources or copy video pixels.

## Popup boundary

Hooks isolate local settings, shortcut bindings, page availability and video snapshots. Functions passed to `chrome.scripting.executeScript` must remain self-contained because Chrome serializes them into another frame; they cannot close over imported helpers. This intentional boundary explains the separate traversal in page counting and thumbnail capture.

The snapshot helper selects the largest decodable video and creates a temporary reduced canvas. Blank, tainted or protected frames fall back to the geometric preview. Snapshots exist only in popup memory. See `PRIVACY.md`.

## Build and distribution

Vite emits popup and worker modules first, followed by an IIFE content script. The second build preserves `dist/` and does not copy public files again. Production validation checks manifest/version alignment, required files, localized metadata lengths, licenses and the absence of source maps.

ZIP packaging sorts paths, fixes archive timestamps and verifies each entry after compression. Icons come from one SVG master. Promo capture installs the actual extension into Chromium and uses an original, local canvas-stream video fixture.
