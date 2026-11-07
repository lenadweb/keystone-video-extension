import assert from 'node:assert/strict';
import { test } from 'node:test';
import { corners } from 'src/shared/utils/geometry/corners';
import { buildMatrix3d } from 'src/shared/utils/geometry/matrix';
import { horizontalTilt, verticalTilt } from 'src/shared/utils/geometry/tilt';
import { clampPercent } from 'src/shared/utils/percent';

test('projective matrix maps all four video corners to the requested quadrilateral', () => {
    for (const width of [320, 1920, 3840]) {
        const height = (width * 9) / 16;
        for (const vertical of [-20, -7.5, 0, 3.2, 20]) {
            for (const horizontal of [-20, -7.5, 0, 3.2, 20]) {
                if (!vertical && !horizontal) continue;
                const matrix = buildMatrix3d(
                    vertical,
                    horizontal,
                    width,
                    height
                )!;
                const m = matrix.slice(9, -1).split(',').map(Number);
                const source = [
                    [0, 0],
                    [width, 0],
                    [0, height],
                    [width, height],
                ];
                const destination = corners(vertical, horizontal);
                source.forEach(([x, y], index) => {
                    const denominator = m[3] * x + m[7] * y + m[15];
                    const actualX = (m[0] * x + m[4] * y + m[12]) / denominator;
                    const actualY = (m[1] * x + m[5] * y + m[13]) / denominator;
                    assert.ok(
                        Math.abs(actualX - destination[index][0] * width) < 0.01
                    );
                    assert.ok(
                        Math.abs(actualY - destination[index][1] * height) <
                            0.01
                    );
                });
            }
        }
    }
});

test('neutral correction and non-positive dimensions do not produce a transform', () => {
    assert.equal(buildMatrix3d(0, 0, 1920, 1080), null);
    assert.equal(buildMatrix3d(10, 0, 0, 1080), null);
    assert.equal(buildMatrix3d(10, 0, 1920, -1), null);
});

test('invalid and excessive percentages normalize safely', () => {
    for (const value of [undefined, null, NaN, Infinity, 'invalid'])
        assert.equal(clampPercent(value), 0);
    assert.equal(clampPercent(300), 20);
    assert.equal(clampPercent(-300), -20);
    assert.equal(clampPercent('2.345'), 2.35);
    assert.equal(horizontalTilt(0), 0);
    assert.equal(verticalTilt(10), verticalTilt(-10));
});
