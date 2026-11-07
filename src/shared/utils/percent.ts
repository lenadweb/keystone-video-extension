import { LIMIT } from 'src/shared/constants/geometry';

export const round = (value: number): number => Math.round(value * 100) / 100;

export const clampPercent = (value: unknown): number => {
    const number = Number(value);
    if (!Number.isFinite(number)) return 0;
    return round(Math.max(-LIMIT, Math.min(LIMIT, number)));
};

export const formatPercent = (value: number): string => {
    const magnitude = Math.abs(clampPercent(value));
    const digits = Number.isInteger(Math.round(magnitude * 100) / 10) ? 1 : 2;
    return `${magnitude.toFixed(digits)}%`;
};
