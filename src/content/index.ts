import { startContent } from 'src/content/runtime';

type KeystoneContent = {
    version: string;
    destroy: () => void;
};

declare global {
    interface Window {
        __keystoneContent?: KeystoneContent;
    }
}

const VERSION = chrome.runtime.getManifest().version;

const previous = window.__keystoneContent;
if (import.meta.env.DEV || previous?.version !== VERSION) {
    try {
        previous?.destroy();
    } catch (error) {
        console.error('Keystone: unable to stop the previous instance', error);
    }
    window.__keystoneContent = { version: VERSION, destroy: startContent() };
}
