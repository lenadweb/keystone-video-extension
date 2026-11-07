# Visual identity

The popup is the baseline and is not being restyled. Its existing Manrope typography, dark surfaces and blue controls remain intact. Video counts and page-support status are not displayed in the popup.

External branding uses the Material 3 idea of a clear silhouette, rounded geometry and a tonal primary/container pairing. A rounded square contains a projected trapezoid and a smaller, squared screen. The negative space describes the correction; no text or fine detail is required inside the icon.

The source of truth is `src/assets/icons/logo.svg`. The master uses a 108-unit grid, a 66-unit central symbol and a 24-unit container radius. The monochrome variant retains the silhouette. Chrome's 128px export has a 96px artwork area with 16px transparent padding. Smaller toolbar exports use more of their canvas for legibility.

Primary: `#2563EB`. Primary container: `#DCE5FF`. Foreground: `#F2F5FF`. Ink: `#172554`. Promotional backgrounds use `#101D3B` and `#DCE5FF`. Flat tones, no gradients or drop shadows in the mark.

The store uses one main composition: projector-focused copy on the left and a large screenshot of the actual popup on the right. Small, marquee and social images repeat that structure, shortening the copy where necessary. Use the existing tonal blue background and Manrope. Show the whole popup; do not add a fabricated browser or player around it. The thumbnail inside the popup comes from the original local video fixture. Sources and export instructions live in `store/README.md`, and the editable composition is `store/promo/template.html`.

The step selector is 36px high: use 18px outer caps and selected corners, with 6px inner corners on unselected segments. Avoid mixing an oversized full radius with small radii on the same element. Keep the focused segment above its neighbors so its outline stays visible.
