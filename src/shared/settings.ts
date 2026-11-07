import { clampPercent } from 'src/shared/keystone';

export const SETTINGS_KEY = 'keystone';

export const STEP_OPTIONS = [0.1, 0.5, 1] as const;
export type Step = (typeof STEP_OPTIONS)[number];

export type KeystoneSettings = {
    enabled: boolean;
    vertical: number;
    horizontal: number;
    step: Step;
};

export const DEFAULT_SETTINGS: KeystoneSettings = {
    enabled: true,
    vertical: 0,
    horizontal: 0,
    step: 0.1,
};

const isStep = (value: number): value is Step =>
    STEP_OPTIONS.some((option) => option === value);

export const normalizeSettings = (value: unknown): KeystoneSettings => {
    const stored =
        value && typeof value === 'object'
            ? (value as Partial<Record<keyof KeystoneSettings, unknown>>)
            : {};
    const step = Number(stored.step);
    const enabled = stored.enabled;

    return {
        enabled:
            typeof enabled === 'boolean' ? enabled : DEFAULT_SETTINGS.enabled,
        vertical: clampPercent(stored.vertical as number | string | undefined),
        horizontal: clampPercent(
            stored.horizontal as number | string | undefined
        ),
        step: isStep(step) ? step : DEFAULT_SETTINGS.step,
    };
};

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
