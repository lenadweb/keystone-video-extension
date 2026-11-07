import { EPSILON } from 'src/shared/constants/geometry';
import type { Homography, Quad } from 'src/shared/types/geometry';

export const homography = (quad: Quad): Homography => {
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
