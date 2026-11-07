import { SETTINGS_KEY } from 'src/shared/constants/settings';
import type { KeystoneSettings } from 'src/shared/types/settings';
import { normalizeSettings } from 'src/shared/utils/settings';

export const loadSettings = async (): Promise<KeystoneSettings> => {
    const stored = await chrome.storage.local.get(SETTINGS_KEY);
    return normalizeSettings(stored[SETTINGS_KEY]);
};

export const saveSettings = (settings: KeystoneSettings): Promise<void> =>
    chrome.storage.local.set({ [SETTINGS_KEY]: settings });

export const onSettingsChange = (
    listener: (settings: KeystoneSettings) => void
): (() => void) => {
    const handleChange = (
        changes: Record<string, chrome.storage.StorageChange>,
        areaName: string
    ) => {
        if (areaName !== 'local' || !changes[SETTINGS_KEY]) return;
        listener(normalizeSettings(changes[SETTINGS_KEY].newValue));
    };

    chrome.storage.onChanged.addListener(handleChange);
    return () => chrome.storage.onChanged.removeListener(handleChange);
};
