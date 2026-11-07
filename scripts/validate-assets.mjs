import { access } from 'node:fs/promises';
import { PROMO_FORMATS, OBSOLETE_PROMO_FILES } from './promo/formats.mjs';
import assert from 'node:assert/strict';
import sharp from 'sharp';

for (const { name, width, height } of PROMO_FORMATS) {
    const metadata = await sharp(`store/assets/${name}.png`).metadata();
    assert.deepEqual([metadata.width, metadata.height], [width, height], name);
    assert.equal(metadata.hasAlpha, false, `${name}: use an opaque PNG`);
}
for (const path of OBSOLETE_PROMO_FILES) {
    await assert.rejects(access(path), { code: 'ENOENT' });
}
for (const size of [16, 32, 48, 128]) {
    const { info, data } = await sharp(`public/icons/${size}.png`)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
    assert.deepEqual([info.width, info.height], [size, size]);
    assert.equal(data[3], 0, 'Icon corners must be transparent');
    if (size === 128) {
        for (let y = 0; y < size; y += 1)
            for (let x = 0; x < size; x += 1) {
                if (x < 16 || x >= 112 || y < 16 || y >= 112)
                    assert.equal(data[(y * size + x) * 4 + 3], 0);
            }
    }
}
console.log(
    'Validated store dimensions, opaque exports and transparent icon padding.'
);
