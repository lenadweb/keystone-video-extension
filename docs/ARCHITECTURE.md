# Architecture

Keystone runs in three isolated contexts: a React popup, a Manifest V3 service worker and a content script in every accessible frame. Their common contract is a validated settings object stored in `chrome.storage.local`.

The structure groups code by runtime context, then by responsibility. `shared` contains only contracts, configuration, computations and browser services needed across contexts. Each feature owns its private types, configuration and implementation. There are no barrel exports or catch-all utility files.

## Source layout

```text
src/
  shared/
    constants/       Common defaults, limits, command mappings and links
    enums/           Axis, command, message type and adjustment step
    types/           Settings, geometry, messages, translations and disposal
    utils/           Pure percent, settings, command and shortcut functions
      geometry/      Corners, homography, matrix serialization and tilt
    services/        Chrome storage, commands, tabs, i18n and runtime APIs
  popup/
    components/      Rendering and user event bindings
    hooks/           React state, subscriptions and polling lifetimes
    constants/       Axis configuration, control styles and preview settings
    enums/           Page status, button tone and tooltip variants
    types/           Component props, page status and snapshot contracts
    utils/           Pure preview sizing, slider styles and view models
    services/        Page inspection, injection fallback and snapshot requests
    injected/        Self-contained functions serialized into page frames
  content/
    controllers/     Stateful lifecycle, video registry, updates and OSD
    dom/             DOM traversal, styles, popovers and browser events
    constants/       Retry delays, CSS and controlled properties
    enums/           Controlled CSS property names
    types/           Controller contracts, style backups and Window extension
    utils/           Pure style-backup transitions and correction summaries
  worker/
    services/        Command execution and on-screen feedback requests
    index.ts         Serialized command listener
```

## Dependency rules

A runtime context can import its own modules and `shared`; it cannot import another context's implementation. Shared modules do not import popup, content or worker code.

- `types/` contains type contracts and type-only imports.
- `enums/` contains closed domain sets. Axis, step, command, message and UI variants use enums. Native DOM strings and Chrome API contracts retain their platform types.
- `constants/` contains static defaults and configuration. Runtime lookups, such as the installed version, belong to services.
- `utils/` contains deterministic calculations with explicit inputs. These modules do not read Chrome APIs, the DOM, navigator or React state, and do not import services, controllers, hooks or components. Translation and platform decisions are passed in where needed.
- `services/` owns Chrome API effects and frame-request fallback.
- `dom/` owns DOM reads, mutations and browser event subscriptions. These functions are deliberately separated from pure utilities.
- `controllers/` owns mutable state, timers, observers and disposal. Functions nested here retain a particular controller instance's state; reusable calculations remain at module scope.
- Components render markup; hooks manage React lifetimes. Component props, variants and reusable configuration are imported from their dedicated folders.

`npm run lint:architecture` validates declarations, context boundaries, direct utility dependencies, browser-global access, self-contained injection imports and import cycles. `verbatimModuleSyntax`, unused-import checks and ESLint type-import rules keep runtime and type dependencies explicit. These checks run as part of `npm run check` and CI.

## Geometry and settings

`shared/utils/geometry/corners.ts` constructs the destination quadrilateral. `homography.ts` maps the unit square to it. `matrix.ts` converts normalized coefficients into a CSS `matrix3d()` accepting pixel coordinates. `tilt.ts` computes projector-angle estimates. Percentage bounds, formatting and rounding live in `shared/utils/percent.ts`.

Positive vertical values narrow the top; negative values narrow the bottom. Positive horizontal values narrow the right; negative values narrow the left. Values are clamped to ±20% and rounded to hundredths. Matrix coefficients retain twelve decimal places. The matrix expects `transform-origin: 0 0`; neutral correction returns `null` so original styles can be restored. Tilt estimates assume a 16:9 image and 1.2:1 throw ratio.

`shared/utils/settings.ts` normalizes untrusted data without browser access. `shared/services/settings.ts` loads, saves and subscribes to that data through Chrome storage. `shared/utils/commandSettings.ts` reduces a command and settings object into the next settings. The worker serializes command execution so held keys do not race through storage reads and writes.

## Content lifecycle

`content/index.ts` is only a version guard and bootstrap. It disposes the previous content instance before replacing it.

`controllers/runtime.ts` connects settings subscriptions, keyboard feedback and page lifecycle events. It delegates video work to `videoCorrection.ts`, which owns the active-video registry and composes discovery, observers, style ownership and the update queue.

- `discovery.ts` observes inserted and removed subtrees. DOM traversal is in `dom/videos.ts`, including recursive visits to open shadow roots. Connected, reparented videos remain registered.
- `videoObservers.ts` owns resize and inline-style observers.
- `videoUpdates.ts` batches updates and manages fullscreen retry timers.
- `videoStyles.ts` coordinates correction and restoration. `dom/videoStyles.ts` reads and writes inline properties; `utils/styleBackup.ts` calculates restoration-state changes without mutating its inputs. A site-written value becomes the new restoration target. Unchanged important properties are not rewritten, preventing a mutation feedback loop.
- `osd.ts` owns an instance's feedback elements and timers. `dom/osd.ts` builds the elements and handles the popover; CSS and timing live in constants. `utils/summary.ts` formats the readout.
- `dom/pageLifecycle.ts` binds fullscreen, resize, visibility and back/forward-cache events and returns one disposal function.

Disposal disconnects observers and listeners, cancels timers, restores video styles and removes feedback. Content scripts do not fetch resources or copy video pixels.

## Popup and frame injection

Hooks connect React state to services; components receive typed props and render the existing approved UI. Pure view helpers accept translation functions or other runtime choices as arguments.

`popup/services/scripting.ts` implements the all-frames request with top-frame fallback. Counting and snapshot services reuse that policy. `popup/injected/countVideos.ts` and `captureVideo.ts` contain the functions passed to `chrome.scripting.executeScript`.

Chrome serializes an injected function into another execution environment. It cannot close over imports or module-level constants. Injected files therefore have type-only imports; snapshot configuration is passed through `args`. Their small iterative shadow-root traversals are intentionally local. Extracting that traversal into a runtime import would break injection. Cross-frame snapshot selection is a separate pure function in `popup/utils/snapshots.ts`.

Capture selects the largest decodable video and creates a temporary reduced canvas. Blank, tainted or protected frames use the geometric fallback. Snapshots exist only in popup memory. See `PRIVACY.md`.

## Build and distribution

Vite emits popup and worker modules first, then an IIFE content script. The second build preserves `dist/` and does not copy public files again. Production validation checks versions, localized metadata, required files, licenses and source maps.

ZIP packaging sorts paths, fixes timestamps and verifies every archived file. Icons come from one SVG master. Promo capture loads the actual extension into Chromium and uses the original local video fixture. Architectural refactoring does not require changing the approved popup layout or marketing images when its rendered behavior is unchanged.
