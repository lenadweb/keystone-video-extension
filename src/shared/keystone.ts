export const LIMIT = 20;
export const SLIDER_STEP = 0.1;
export const THROW_RATIO = 1.2;

const ASPECT_RATIO = 16 / 9;
const EPSILON = 1e-9;

export type Point = [number, number];
export type Quad = [Point, Point, Point, Point];

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

export const corners = (vertical: number, horizontal: number): Quad => {
    const v = clampPercent(vertical) / 100;
    const h = clampPercent(horizontal) / 100;
    const topLeft: Point = [0, 0];
    const topRight: Point = [1, 0];
    const bottomLeft: Point = [0, 1];
    const bottomRight: Point = [1, 1];

    if (v > 0) {
        topLeft[0] += v;
        topRight[0] -= v;
    } else if (v < 0) {
        bottomLeft[0] -= v;
        bottomRight[0] += v;
    }

    if (h > 0) {
        topRight[1] += h;
        bottomRight[1] -= h;
    } else if (h < 0) {
        topLeft[1] -= h;
        bottomLeft[1] += h;
    }

    return [topLeft, topRight, bottomLeft, bottomRight];
};

const homography = (quad: Quad): number[] => {
    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad;
    const dx1 = x1 - x2;
    const dx2 = x3 - x2;
    const dx3 = x0 - x1 + x2 - x3;
    const dy1 = y1 - y2;
    const dy2 = y3 - y2;
    const dy3 = y0 - y1 + y2 - y3;

    if (Math.abs(dx3) < EPSILON && Math.abs(dy3) < EPSILON) {
        return [x1 - x0, x3 - x0, x0, y1 - y0, y3 - y0, y0, 0, 0, 1];
    }

    const determinant = dx1 * dy2 - dx2 * dy1;
    if (Math.abs(determinant) < EPSILON) return [1, 0, 0, 0, 1, 0, 0, 0, 1];

    const g = (dx3 * dy2 - dx2 * dy3) / determinant;
    const h = (dx1 * dy3 - dx3 * dy1) / determinant;

    return [
        x1 - x0 + g * x1,
        x3 - x0 + h * x3,
        x0,
        y1 - y0 + g * y1,
        y3 - y0 + h * y3,
        y0,
        g,
        h,
        1,
    ];
};

const matrixValue = (value: number): number => {
    const rounded = Number(value.toFixed(12));
    return Object.is(rounded, -0) ? 0 : rounded;
};

export const buildMatrix3d = (
    vertical: number,
    horizontal: number,
    width: number,
    height: number
): string | null => {
    if (width <= 0 || height <= 0) return null;
    if (clampPercent(vertical) === 0 && clampPercent(horizontal) === 0) {
        return null;
    }

    const [topLeft, topRight, bottomLeft, bottomRight] = corners(
        vertical,
        horizontal
    );
    const [m00, m01, m02, m10, m11, m12, m20, m21, m22] = homography([
        topLeft,
        topRight,
        bottomRight,
        bottomLeft,
    ]);

    const values = [
        m00,
        (m10 * height) / width,
        0,
        m20 / width,
        (m01 * width) / height,
        m11,
        0,
        m21 / height,
        0,
        0,
        1,
        0,
        m02 * width,
        m12 * height,
        0,
        m22,
    ].map(matrixValue);

    return `matrix3d(${values.join(', ')})`;
};

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
