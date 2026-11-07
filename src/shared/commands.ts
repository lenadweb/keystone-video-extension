import type { KeystoneSettings } from 'src/shared/settings';

export enum Command {
    NarrowTop = 'narrow_top',
    NarrowBottom = 'narrow_bottom',
    NarrowLeft = 'narrow_left',
    NarrowRight = 'narrow_right',
    Reset = 'reset',
    Toggle = 'toggle',
}

export type Shortcuts = Partial<Record<Command, string>>;

export const OSD_MESSAGE = 'keystone:osd';

export type OsdMessage = {
    type: typeof OSD_MESSAGE;
    settings: KeystoneSettings;
};

export const SHORTCUTS_PAGE = 'chrome://extensions/shortcuts';

const IS_MAC =
    typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent);

const MAC_SYMBOLS: Record<string, string> = {
    Command: '⌘',
    Ctrl: '⌃',
    MacCtrl: '⌃',
    Alt: '⌥',
    Option: '⌥',
    Shift: '⇧',
};

const ARROWS: Record<string, string> = {
    Up: '↑',
    Down: '↓',
    Left: '←',
    Right: '→',
};

export const formatShortcut = (shortcut: string): string => {
    if (!shortcut.includes('+')) return shortcut;
    const parts = shortcut.split('+').map((part) => {
        const key = part.trim();
        return ARROWS[key] ?? (IS_MAC ? (MAC_SYMBOLS[key] ?? key) : key);
    });
    return parts.join(IS_MAC ? '' : '+');
};

export const loadShortcuts = async (): Promise<Shortcuts> => {
    const shortcuts: Shortcuts = {};
    try {
        const commands = await chrome.commands.getAll();
        commands.forEach(({ name, shortcut }) => {
            if (name && shortcut) {
                shortcuts[name as Command] = formatShortcut(shortcut);
            }
        });
    } catch {
        return {};
    }
    return shortcuts;
};
