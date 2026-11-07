import { ASPECT_RATIO, THROW_RATIO } from 'src/shared/constants/geometry';
import { clampPercent, round } from 'src/shared/utils/percent';

export const tiltAngle = (
    percent: number,
    halfFieldTangent: number
): number => {
    const k = Math.abs(clampPercent(percent)) / 100;
    if (k === 0 || !(halfFieldTangent > 0)) return 0;
    return round((Math.atan(k / ((1 - k) * halfFieldTangent)) * 180) / Math.PI);
};

export const verticalTilt = (
    percent: number,
    throwRatio = THROW_RATIO
): number => tiltAngle(percent, 1 / (2 * throwRatio * ASPECT_RATIO));

export const horizontalTilt = (
    percent: number,
    throwRatio = THROW_RATIO
): number => tiltAngle(percent, 1 / (2 * throwRatio));
