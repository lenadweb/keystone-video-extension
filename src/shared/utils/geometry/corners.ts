import type { Point, Quad } from 'src/shared/types/geometry';
import { clampPercent } from 'src/shared/utils/percent';

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
