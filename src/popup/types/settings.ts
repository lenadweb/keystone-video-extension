import type { KeystoneSettings } from 'src/shared/types/settings';

export type KeystoneSettingsController = {
    settings: KeystoneSettings | null;
    update: (patch: Partial<KeystoneSettings>) => void;
    resetCorrection: () => void;
};
