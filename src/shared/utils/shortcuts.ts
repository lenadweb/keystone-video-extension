import { ARROWS, MAC_SYMBOLS } from 'src/shared/constants/shortcuts';

export const formatShortcut = (shortcut: string, isMac: boolean): string => {
    if (!shortcut.includes('+')) return shortcut;
    const parts = shortcut.split('+').map((part) => {
        const key = part.trim();
        return ARROWS[key] ?? (isMac ? (MAC_SYMBOLS[key] ?? key) : key);
    });
    return parts.join(isMac ? '' : '+');
};
