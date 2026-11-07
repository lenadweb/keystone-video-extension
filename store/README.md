# Publication assets

One main store image pairs a short projector-focused explanation on the left with a large, actual Keystone popup on the right. The small tile, marquee and social preview use the same composition, with shorter copy at small sizes. There are no fabricated browser windows or separate player mockups.

The popup is captured from the built extension, loaded unpacked into Chromium. Its video thumbnail comes from the original local video fixture in `tests/fixtures/player.html`. The application interface is not restyled for marketing. Shortcut symbols reflect the capture operating system.

## Upload files

| File in `store/assets/` | Dimensions | Use                                                    |
| ----------------------- | ---------- | ------------------------------------------------------ |
| `icon-128.png`          | 128 × 128  | Store icon, 96px artwork with 16px transparent padding |
| `01-projector.png`      | 1280 × 800 | Main and only store screenshot                         |
| `promo-small.png`       | 440 × 280  | Small promotional tile                                 |
| `promo-marquee.png`     | 1400 × 560 | Marquee promotional tile                               |
| `social-1280x640.png`   | 1280 × 640 | GitHub/social preview, not a store screenshot          |

The images are opaque RGB PNGs with full-bleed, square outer edges. The store icon retains transparency. Text is rendered using the bundled Manrope font in Chromium, and every format shows the whole popup. The main headline is “Keystone correction for your projector.”

Dimensions and icon padding follow [Chrome's image guidance](https://developer.chrome.com/docs/webstore/images). The original logo takes inspiration from [Material 3 icon principles](https://m3.material.io/styles/icons/designing-icons) and [Android's icon geometry](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive); this browser extension does not contain an Android app or claim Google endorsement.

## Sources and regeneration

Edit the promotional layout and copy in `store/promo/template.html`. Its per-format styles adapt the same layout to each export. Format dimensions and obsolete-file cleanup are configured in `scripts/promo/formats.mjs`. Rendering and capture are coordinated by `scripts/generate-promo.mjs`.

The vector logo master remains `src/assets/icons/logo.svg`. A monochrome mark is in `docs/brand/`. Brand constraints are recorded in `docs/DESIGN.md`.

```bash
npm ci
npx playwright install chromium
npm run assets
npm run promo
npm run assets:check
```

An existing Chromium can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. The default uses Playwright's installed Chromium. Review every export after changing Chromium or fonts; rasterization can vary by platform. The demo uses a canvas stream, so no third-party video download or capture is required.

`description.md` is ready-to-copy listing text. `metadata.json` records links and leaves the store URL/ID unset until publication. `permissions.md` contains privacy/review answers, including the local video-thumbnail behavior. See `docs/RELEASING.md` for submission steps.
