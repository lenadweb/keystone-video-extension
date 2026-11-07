# Chrome Web Store review answers

## Single purpose

Correct keystone distortion on HTML videos in Chrome using vertical and horizontal perspective transforms, with local controls, keyboard shortcuts and a temporary preview.

## storage

Saves only enabled state, vertical and horizontal correction and adjustment step in `chrome.storage.local`. These settings stay on the device and are removed by uninstalling. No remote synchronization is used.

## scripting

When the popup is open, the extension initializes the active tab's content script if necessary, counts visible videos and attempts to capture a reduced still frame from the largest accessible video for the popup preview. Preview capture can repeat on focus, during brief startup retries and approximately every ten seconds while the popup remains open.

The canvas and encoded thumbnail are temporary, in-memory data. They are not saved, transmitted or shared. Cross-origin and protected-video restrictions are respected; capture failure produces a geometric fallback. No scripting-based capture runs after the popup closes.

## Host permission: `<all_urls>`

Videos can be hosted on arbitrary sites or inside embedded player frames. Broad host access lets the declarative content script discover video elements and apply the same correction in each accessible frame. The popup's scripting calls need access to inspect those videos and render the local preview.

Content scripts read video dimensions and inline transform-related properties. The popup additionally reads video pixels solely for the temporary preview described above. The extension does not read page text, form inputs, passwords or browsing history and does not upload video content.

## Content scripts in all frames

`all_frames` supports embedded players. `match_origin_as_fallback` covers eligible `about:blank`, `data:` and `blob:` frames based on the initiator origin. Chrome's restricted pages, protected frames and site-access restrictions still apply.

## Remote code

No. Executable code, font and icons are bundled with the extension. No external scripts, code-loading endpoints or analytics SDKs are used.

## Data practices

The extension does not collect, transmit, sell or share user data. It stores settings locally and processes video thumbnails transiently on the device. Do not describe the preview as “no video access”: it reads a still frame in memory when possible. Keep dashboard disclosures consistent with this policy and the store's current definitions.

## Reviewer instructions

No sign-in, purchase, account or backend is required.

1. Load the extension and open a normal HTTPS page with an HTML video. Pin the toolbar icon if needed.
2. Open the popup. Move Vertical or Horizontal away from zero; the video should become a corrected quadrilateral.
3. Use the plus/minus buttons and change the Step value.
4. Turn correction off; the original appearance should return. Turn it on again to recover the saved setup.
5. Assign shortcuts at `chrome://extensions/shortcuts` if Chrome has not assigned defaults. Try an axis shortcut and observe the brief readout.
6. Try a container-based fullscreen player. Picture-in-picture and native video-element fullscreen are documented limitations.

For a deterministic local demo, contributors can run `npm run promo`; its fixture uses an original canvas-stream video and the actual unpacked extension. Captured screenshots contain no third-party film material.
