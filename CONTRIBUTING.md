# Contributing

Use Node.js 22.12+ and npm 10. Start with `npm ci`, `npm run build` and the unpacked installation steps in the README.

Before making a substantial behavior change, describe the use case in an issue. Small fixes can go straight to a pull request. Keep each change focused and describe the trigger, the resulting behavior and the checks you ran.

## Checks

Run `npm run check`, `npm run format:check` and `npm run test:browser` before submitting. Install the test browser once with `npx playwright install chromium`. The browser suite loads the actual extension; it is not a simulation of Chrome APIs. For an existing Chromium executable, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

Add a regression test when changing geometry, settings normalization or video lifecycle behavior. Explain assumptions in `docs/ARCHITECTURE.md` and use descriptive names in code. This project intentionally keeps source code free of comments; `npm run lint:comments` enforces this.

Keep application UI changes separate from infrastructure changes. The approved popup design is documented in `docs/DESIGN.md`. Regenerate icons with `npm run assets` and external images with `npm run promo` when changing the brand or a visible feature.

Do not introduce remote code, analytics or video uploads. Update the privacy policy and permission explanations when changing page access or data handling. Preserve dependency license notices.

## Bug reports

Include the extension version, Chrome version, operating system, a public reproduction URL if available and the expected versus actual behavior. State whether the player uses an iframe, fullscreen or picture-in-picture. Avoid sharing credentials, private URLs or captured private frames.

## License

By contributing, you agree that your contribution is distributed under the project's MIT license. New third-party assets must include their source and compatible license.
