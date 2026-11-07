import { NUDGES } from 'src/shared/constants/commands';
import { Command } from 'src/shared/enums/command';
import type { KeystoneSettings } from 'src/shared/types/settings';

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
