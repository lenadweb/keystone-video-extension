import { DEFAULT_SETTINGS, STEP_OPTIONS } from 'src/shared/constants/settings';
import type { Step } from 'src/shared/enums/step';
import type { KeystoneSettings } from 'src/shared/types/settings';
import { clampPercent } from 'src/shared/utils/percent';

export const isStep = (value: number): value is Step =>
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
        vertical: clampPercent(stored.vertical),
        horizontal: clampPercent(stored.horizontal),
        step: isStep(step) ? step : DEFAULT_SETTINGS.step,
    };
};
