import { MATRIX_PRECISION } from 'src/shared/constants/geometry';
import { corners } from 'src/shared/utils/geometry/corners';
import { homography } from 'src/shared/utils/geometry/homography';
import { clampPercent } from 'src/shared/utils/percent';

const matrixValue = (value: number): number => {
    const rounded = Number(value.toFixed(MATRIX_PRECISION));
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
