import { Step } from 'src/shared/enums/step';
import type { KeystoneSettings } from 'src/shared/types/settings';

export const SETTINGS_KEY = 'keystone';

export const STEP_OPTIONS = [Step.Fine, Step.Medium, Step.Coarse] as const;

export const DEFAULT_SETTINGS: KeystoneSettings = {
    enabled: true,
    vertical: 0,
    horizontal: 0,
    step: Step.Fine,
};
