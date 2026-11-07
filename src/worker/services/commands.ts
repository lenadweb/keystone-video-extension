import { MessageType } from 'src/shared/enums/message';
import { loadSettings, saveSettings } from 'src/shared/services/settings';
import type { OsdMessage } from 'src/shared/types/commands';
import { nextSettings } from 'src/shared/utils/commandSettings';
import { normalizeSettings } from 'src/shared/utils/settings';

export const runCommand = async (
    command: string,
    tab?: chrome.tabs.Tab
): Promise<void> => {
    const current = await loadSettings();
    const changed = nextSettings(command, current);
    const settings = changed ? normalizeSettings(changed) : current;
    if (changed) await saveSettings(settings);

    if (tab?.id !== undefined) {
        const message: OsdMessage = { type: MessageType.Osd, settings };
        chrome.tabs.sendMessage(tab.id, message).catch(() => undefined);
    }
};
