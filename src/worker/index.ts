import { nextSettings } from 'src/shared/commandSettings';
import { OSD_MESSAGE, OsdMessage } from 'src/shared/commands';
import {
    loadSettings,
    normalizeSettings,
    saveSettings,
} from 'src/shared/settings';

const runCommand = async (
    command: string,
    tab?: chrome.tabs.Tab
): Promise<void> => {
    const current = await loadSettings();
    const changed = nextSettings(command, current);
    const settings = changed ? normalizeSettings(changed) : current;
    if (changed) await saveSettings(settings);

    if (tab?.id !== undefined) {
        const message: OsdMessage = { type: OSD_MESSAGE, settings };
        chrome.tabs.sendMessage(tab.id, message).catch(() => undefined);
    }
};

let queue = Promise.resolve();

chrome.commands.onCommand.addListener((command, tab) => {
    queue = queue.then(() => runCommand(command, tab)).catch(console.error);
});
