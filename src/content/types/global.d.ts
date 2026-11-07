import type { KeystoneContent } from 'src/content/types/runtime';

declare global {
    interface Window {
        __keystoneContent?: KeystoneContent;
    }
}
