import { Command } from 'src/shared/commands';
import type { KeystoneSettings } from 'src/shared/settings';

const NUDGES: Partial<Record<Command, ['vertical' | 'horizontal', 1 | -1]>> = {
    [Command.NarrowTop]: ['vertical', 1],
    [Command.NarrowBottom]: ['vertical', -1],
    [Command.NarrowLeft]: ['horizontal', -1],
    [Command.NarrowRight]: ['horizontal', 1],
};

export const nextSettings = (
    command: string,
    settings: KeystoneSettings
): KeystoneSettings | null => {
    if (command === Command.Toggle) {
        return { ...settings, enabled: !settings.enabled };
    }
    if (!settings.enabled) return null;
    if (command === Command.Reset) {
        return { ...settings, vertical: 0, horizontal: 0 };
    }
    const nudge = NUDGES[command as Command];
    if (!nudge) return null;
    const [axis, direction] = nudge;
    return { ...settings, [axis]: settings[axis] + direction * settings.step };
};
