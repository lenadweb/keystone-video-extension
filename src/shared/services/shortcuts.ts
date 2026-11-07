import type { Command } from 'src/shared/enums/command';
import type { Shortcuts } from 'src/shared/types/commands';
import { formatShortcut } from 'src/shared/utils/shortcuts';

export const loadShortcuts = async (): Promise<Shortcuts> => {
    const shortcuts: Shortcuts = {};
    try {
        const commands = await chrome.commands.getAll();
        commands.forEach(({ name, shortcut }) => {
            if (name && shortcut) {
                shortcuts[name as Command] = formatShortcut(
                    shortcut,
                    /Mac/.test(navigator.userAgent)
                );
            }
        });
    } catch {
        return {};
    }
    return shortcuts;
};
