import { chromium } from '@playwright/test';
import { resolve } from 'node:path';

export const launchExtension = async () => {
    const extension = resolve('dist');
    const context = await chromium.launchPersistentContext('', {
        headless: true,
        channel: 'chromium',
        executablePath:
            process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
        args: [
            `--disable-extensions-except=${extension}`,
            `--load-extension=${extension}`,
        ],
        viewport: { width: 1280, height: 800 },
    });
    const worker =
        context.serviceWorkers()[0] ||
        (await context.waitForEvent('serviceworker'));
    const id = new URL(worker.url()).host;
    return { context, worker, popupUrl: `chrome-extension://${id}/popup.html` };
};
