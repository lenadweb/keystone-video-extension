import { setTimeout } from 'node:timers/promises';
import sharp from 'sharp';

export const capturePopup = async (context, worker, page) => {
    await page.bringToFront();
    const cdp = await context.newCDPSession(page);
    await worker.evaluate(() => chrome.action.openPopup());
    let target;
    for (let attempt = 0; attempt < 50 && !target; attempt += 1) {
        const { targetInfos } = await cdp.send('Target.getTargets');
        target = targetInfos.find((item) => item.url.endsWith('/popup.html'));
        if (!target) await setTimeout(100);
    }
    if (!target)
        throw new Error('Chrome did not open the extension action popup.');
    const { sessionId } = await cdp.send('Target.attachToTarget', {
        targetId: target.targetId,
        flatten: false,
    });
    let nextId = 0;
    const pending = new Map();
    cdp.on('Target.receivedMessageFromTarget', ({ message }) => {
        const response = JSON.parse(message);
        if (response.id) pending.get(response.id)?.(response);
    });
    const send = async (method, params = {}) => {
        const id = ++nextId;
        const result = new Promise((resolve, reject) => {
            const timer = globalThis.setTimeout(() => {
                pending.delete(id);
                reject(new Error(`Popup capture timed out: ${method}`));
            }, 10_000);
            pending.set(id, (value) => {
                clearTimeout(timer);
                pending.delete(id);
                resolve(value);
            });
        });
        await cdp.send('Target.sendMessageToTarget', {
            sessionId,
            message: JSON.stringify({ id, method, params }),
        });
        const response = await result;
        if (response.error) throw new Error(JSON.stringify(response.error));
        return response.result;
    };
    try {
        const readiness = await send('Runtime.evaluate', {
            expression: `(async () => {
                await document.fonts.ready;
                for (let attempt = 0; attempt < 50; attempt += 1) {
                    const main = document.querySelector('main');
                    const status = document.querySelector('[role="status"]');
                    const image = document.querySelector('main img');
                    if (main && status?.textContent.includes('video') && image?.complete && image.naturalWidth > 0) {
                        await new Promise(resolve => setTimeout(resolve, 350));
                        return { width: main.offsetWidth, height: main.offsetHeight, viewport: innerHeight };
                    }
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                throw new Error('Popup did not obtain a video preview.');
            })()`,
            awaitPromise: true,
            returnByValue: true,
        });
        if (readiness.exceptionDetails)
            throw new Error(JSON.stringify(readiness.exceptionDetails));
        const { width, height, viewport } = readiness.result.value;
        const tiles = [];
        for (let offset = 0; offset < height; offset += viewport) {
            const position = await send('Runtime.evaluate', {
                expression: `new Promise(resolve => { window.scrollTo(0, ${offset}); requestAnimationFrame(() => requestAnimationFrame(() => resolve(window.scrollY))); })`,
                awaitPromise: true,
                returnByValue: true,
            });
            const top = position.result.value;
            const screenshot = await send('Page.captureScreenshot', {
                format: 'png',
                captureBeyondViewport: false,
            });
            const input = await sharp(Buffer.from(screenshot.data, 'base64'))
                .extract({
                    left: 0,
                    top: 0,
                    width,
                    height: Math.min(viewport, height - top),
                })
                .png()
                .toBuffer();
            tiles.push({ input, left: 0, top });
            if (top + viewport >= height) break;
        }
        return await sharp({
            create: { width, height, channels: 4, background: '#18181b' },
        })
            .composite(tiles)
            .png()
            .toBuffer();
    } finally {
        await send('Runtime.evaluate', { expression: 'window.close()' }).catch(
            () => undefined
        );
        await cdp.detach();
    }
};
