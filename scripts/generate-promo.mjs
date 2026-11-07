import { mkdir, rm, writeFile } from 'node:fs/promises';
import { launchExtension } from './browser.mjs';
import { serveFixture } from './fixture-server.mjs';
import { capturePopup } from './capture-popup.mjs';
import { PROMO_FORMATS, OBSOLETE_PROMO_FILES } from './promo/formats.mjs';
import { loadPromoTemplate, renderPromo } from './promo/render.mjs';

await mkdir('store/assets', { recursive: true });
await mkdir('docs/images', { recursive: true });
const fixture = await serveFixture();
let context;
try {
    const extension = await launchExtension();
    context = extension.context;
    const page = await context.newPage();
    await page.goto(fixture.url);
    await page.waitForFunction(
        () => document.querySelector('video')?.readyState >= 2
    );
    await extension.worker.evaluate(() =>
        chrome.storage.local.set({
            keystone: { enabled: true, vertical: 12, horizontal: 0, step: 0.1 },
        })
    );
    const popup = await capturePopup(context, extension.worker, page);
    await writeFile('docs/images/popup.png', popup);
    const template = await loadPromoTemplate(popup);
    for (const format of PROMO_FORMATS) {
        const image = await renderPromo(context, template, format);
        await writeFile(`store/assets/${format.name}.png`, image);
        if (format.format === 'main')
            await writeFile('docs/images/hero.png', image);
    }
    await Promise.all(
        OBSOLETE_PROMO_FILES.map((path) => rm(path, { force: true }))
    );
} finally {
    await context?.close();
    await fixture.close();
}
console.log(
    'Captured one real-interface store image, matching promo tiles and social preview.'
);
