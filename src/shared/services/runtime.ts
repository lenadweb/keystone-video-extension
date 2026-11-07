export const getExtensionVersion = (): string =>
    chrome.runtime.getManifest().version;
