import { startContent } from 'src/content/controllers/runtime';
import { getExtensionVersion } from 'src/shared/services/runtime';

const version = getExtensionVersion();

const previous = window.__keystoneContent;
if (import.meta.env.DEV || previous?.version !== version) {
    try {
        previous?.destroy();
    } catch (error) {
        console.error('Keystone: unable to stop the previous instance', error);
    }
    window.__keystoneContent = { version: version, destroy: startContent() };
}
