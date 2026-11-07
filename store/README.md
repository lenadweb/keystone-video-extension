# Publication assets

All images are original project artwork. The five screenshots contain the actual built extension, loaded unpacked into Chromium, and a locally rendered landscape video from `tests/fixtures/player.html`. The popup is captured through Chrome's action popup; its pixels are placed alongside the corresponding video screenshot. The application interface is not restyled for marketing. Shortcut symbols reflect the capture operating system.

## Upload files

| File in `store/assets/` | Dimensions | Use                                                    |
| ----------------------- | ---------- | ------------------------------------------------------ |
| `icon-128.png`          | 128 × 128  | Store icon, 96px artwork with 16px transparent padding |
| `01-vertical.png`       | 1280 × 800 | Lead screenshot: vertical correction                   |
| `02-horizontal.png`     | 1280 × 800 | Horizontal correction                                  |
| `03-both-axes.png`      | 1280 × 800 | Combined correction                                    |
| `04-fine-control.png`   | 1280 × 800 | Fine steps and controls                                |
| `05-toggle.png`         | 1280 × 800 | Restore the original without losing settings           |
| `promo-small.png`       | 440 × 280  | Small promotional tile                                 |
| `promo-marquee.png`     | 1400 × 560 | Marquee promotional tile                               |
| `social-1280x640.png`   | 1280 × 640 | GitHub/social preview, not a store screenshot          |

Screenshots and promotional tiles are opaque RGB PNGs with full-bleed, square outer edges. The store icon retains transparency. The promotional tiles avoid text so they remain readable when reduced or shown across locales.

Dimensions and icon padding follow [Chrome's image guidance](https://developer.chrome.com/docs/webstore/images). The original logo takes inspiration from [Material 3 icon principles](https://m3.material.io/styles/icons/designing-icons) and [Android's icon geometry](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive); this browser extension does not contain an Android app or claim Google endorsement.

## Sources and regeneration

The vector master is `src/assets/icons/logo.svg`. A monochrome mark and editable promotional-tile vectors are in `docs/brand/`. Brand constraints are recorded in `docs/DESIGN.md`.

```bash
npm ci
npx playwright install chromium
npm run assets
npm run promo
```

An existing Chromium can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. The default uses Playwright's installed Chromium. Review all exports after changing Chromium or fonts; rasterization can vary by platform. The demo uses a canvas stream, so no third-party video download or capture is required.

`description.md` is ready-to-copy listing text. `metadata.json` records links and leaves the store URL/ID unset until publication. `permissions.md` contains privacy/review answers, including the local video-thumbnail behavior. See `docs/RELEASING.md` for submission steps.
