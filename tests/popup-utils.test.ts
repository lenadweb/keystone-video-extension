import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fitFrame } from '../src/popup/utils/preview';
import { selectLargestSnapshot } from '../src/popup/utils/snapshots';

test('preview fitting preserves landscape, portrait and ultrawide aspect ratios', () => {
    assert.deepEqual(fitFrame(16 / 9), { width: 199, height: 112 });
    assert.deepEqual(fitFrame(9 / 16), { width: 63, height: 112 });
    assert.deepEqual(fitFrame(4), { width: 220, height: 55 });
});

test('snapshot selection ignores inaccessible frames and strips ranking metadata', () => {
    assert.equal(selectLargestSnapshot([null, undefined]), null);
    assert.deepEqual(
        selectLargestSnapshot([
            { src: 'small', width: 640, height: 360, area: 100 },
            null,
            { src: 'large', width: 1920, height: 1080, area: 900 },
        ]),
        { src: 'large', width: 1920, height: 1080 }
    );
});
