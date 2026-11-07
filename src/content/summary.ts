import {
    formatPercent,
    horizontalTilt,
    verticalTilt,
} from 'src/shared/keystone';
import type { KeystoneSettings } from 'src/shared/settings';

const describeAxis = (
    value: number,
    tilt: number,
    positive: string,
    negative: string
): string | null => {
    if (value === 0) return null;
    const side = value > 0 ? positive : negative;
    return `${formatPercent(value)} ${side} (≈${tilt.toFixed(1)}°)`;
};

export const correctionSummary = ({
    enabled,
    vertical,
    horizontal,
}: KeystoneSettings): string => {
    if (!enabled) return 'Keystone: Off';

    const parts = [
        describeAxis(
            vertical,
            verticalTilt(vertical),
            'top narrower',
            'bottom narrower'
        ),
        describeAxis(
            horizontal,
            horizontalTilt(horizontal),
            'right narrower',
            'left narrower'
        ),
    ].filter(Boolean);

    return parts.length
        ? `Keystone: ${parts.join(', ')}`
        : 'Keystone: No correction';
};
