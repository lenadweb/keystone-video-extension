# Release guide

The source and store preparation are local. Uploading a ZIP, making a repository public, publishing a privacy URL and submitting a store listing are separate maintainer actions.

## Prepare

1. Start from a clean checkout with Node.js 22.12+ and npm 10. Run `npm ci`.
2. For a new version, update `CHANGELOG.md`, then use `npm version patch --no-git-tag-version` (or `minor` / `major`). npm updates the lockfile; the version hook updates `public/manifest.json`. Review and commit the package, lockfile, manifest and changelog together, then create the release tag. The flag prevents npm from creating a commit or tag for you. Do not bump merely to rebuild an existing version.
3. Run `npx playwright install chromium`, `npm run package`, `npx playwright test` and `npm run format:check`.
4. Inspect `release/keystone-<version>-chrome.zip` and its SHA-256 file. The ZIP has `manifest.json` at its root, includes license notices and excludes development files and source maps. Repackaging an unchanged `dist/` produces the same archive bytes.
5. If visible behavior or branding changed, run `npm run assets` and `npm run promo`, review every image and commit the updated assets. Promo capture requires the Playwright browser or `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

## Manual playback checks

Test a normal video, a dynamically inserted video, an embedded player and an open shadow root. Check both axes, reset, fine steps, global persistence, toggle, keyboard readout and repeated fullscreen transitions. Confirm that disabling restores the site's video styles. Test a protected player separately if claiming support for it; the automated fixture does not establish compatibility with DRM services.

## Publish source

Confirm the repository owner and URLs in `package.json`, `public/manifest.json`, the popup footer and store metadata. The current owner/repository values follow the project's existing GitHub link. Connect the intended remote, inspect the reconstructed history, then push when ready. Do not force-push over a shared history without coordinating with its users.

Keep secrets, private recordings and local release archives out of Git. The source license is MIT; the font and bundled runtime dependencies retain their notices.

## Submit to Chrome Web Store

- Upload the validated ZIP.
- Copy the name, summary and detailed description from `store/description.md`.
- Upload `store/assets/icon-128.png`, the single `01-projector.png` screenshot and the optional promotional tiles documented in `store/README.md`.
- Enter the public repository/support links from `store/metadata.json` after they resolve publicly.
- Provide a publicly reachable privacy policy. The prepared GitHub URL will work after the repository and `PRIVACY.md` are public; verify it in a signed-out browser.
- Fill in single-purpose, permissions and data-practices answers using `store/permissions.md`, checking the dashboard's current definitions.
- Include the reviewer instructions. There are no test credentials.
- Review the listing preview at reduced size and submit through the dashboard.

Only add a Chrome Web Store badge or install link to the README after an actual public listing exists. Record the issued extension ID and URL in `store/metadata.json` at that point.
