# Privacy policy

Effective date: November 7, 2026. Applies to Keystone - Projector Video Correction, maintained by lenadweb.

Keystone does not collect or transmit personal information. It has no accounts, analytics, advertising, telemetry or backend service, and makes no network requests.

## Local settings

The extension stores its enabled state, vertical and horizontal correction values and adjustment step in `chrome.storage.local`. These settings are shared by the extension's tabs on the same browser profile; they are not synced to other devices. Uninstalling the extension removes this storage.

## Page access and video preview

Content scripts discover HTML video elements, including videos in accessible iframes and open shadow roots. They inspect video dimensions and inline style properties, apply a CSS transform and restore the previous styles when correction is disabled. The extension does not read page text, form inputs, passwords or browsing history.

While the popup is open, Keystone uses Chrome's scripting API to count visible videos and attempt a thumbnail of the largest accessible video. It draws a reduced still frame into a temporary canvas, checks whether it is blank and displays it in the popup. It attempts capture on opening, retries briefly if necessary, on focus and approximately every ten seconds. Browser restrictions prevent capture of some cross-origin or protected video; a geometric preview is used instead.

Thumbnails and temporary pixel data exist only in memory. They are not saved to extension storage, sent to the developer or shared with third parties. Closing the popup discards its preview. The CSS correction continues without reading video pixels.

## Permissions and control

`storage` saves settings. `scripting` initializes the active page and provides the count and preview described above. Broad host access allows video correction across sites and embedded frames. You can restrict site access, disable correction or uninstall Keystone through Chrome's extension settings.

## Third parties and external links

The extension bundles its scripts, icons and font locally. Its GitHub link opens a page only when you choose it; visiting GitHub is subject to GitHub's privacy policy. The extension does not otherwise contact GitHub or another service.

## Questions and changes

Use the [project's issue tracker](https://github.com/lenadweb/keystone-video-extension/issues) for general questions. Do not include sensitive page information or private video frames. Changes to this policy are recorded in the repository and accompanied by an updated effective date.
