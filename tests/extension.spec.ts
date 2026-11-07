import { test, expect, chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

test('installed extension corrects dynamic videos, restores site styles and cleans up on reinjection', async () => {
    const extension = resolve('dist');
    const fixture = await readFile('tests/fixtures/player.html');
    const server = createServer((_, response) =>
        response.writeHead(200, { 'Content-Type': 'text/html' }).end(fixture)
    );
    await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
    const address = server.address() as { port: number };
    const context = await chromium.launchPersistentContext('', {
        headless: true,
        channel: 'chromium',
        executablePath:
            process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
        args: [
            `--disable-extensions-except=${extension}`,
            `--load-extension=${extension}`,
        ],
    });
    try {
        const worker =
            context.serviceWorkers()[0] ||
            (await context.waitForEvent('serviceworker'));
        const page = await context.newPage();
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(`http://127.0.0.1:${address.port}/`);
        await expect(page.locator('video')).toHaveJSProperty('readyState', 4);
        await page.locator('video').evaluate((video) => {
            video.style.setProperty('transform', 'scale(0.9)', 'important');
            video.style.setProperty('transform-origin', '50% 50%');
        });
        await worker.evaluate(() =>
            chrome.storage.local.set({
                keystone: {
                    enabled: true,
                    vertical: 10,
                    horizontal: 4,
                    step: 0.5,
                },
            })
        );
        await expect
            .poll(() =>
                page.locator('video').evaluate((video) => video.style.transform)
            )
            .toMatch(/^matrix3d/);
        await page.evaluate(() => {
            const host = document.createElement('div');
            host.attachShadow({ mode: 'open' }).innerHTML =
                '<video style="width:320px;height:180px"></video>';
            document.body.append(host);
        });
        await expect.poll(() => page.locator('video').count()).toBe(2);
        await expect
            .poll(() =>
                page
                    .locator('video')
                    .nth(1)
                    .evaluate((video) => video.style.transform)
            )
            .toMatch(/^matrix3d/);
        await page
            .locator('video')
            .first()
            .evaluate((video) => {
                video.style.transform = 'scale(0.8)';
            });
        await expect
            .poll(() =>
                page
                    .locator('video')
                    .first()
                    .evaluate((video) => video.style.transform)
            )
            .toMatch(/^matrix3d/);
        await worker.evaluate(() =>
            chrome.storage.local.set({
                keystone: {
                    enabled: false,
                    vertical: 10,
                    horizontal: 4,
                    step: 0.5,
                },
            })
        );
        await expect
            .poll(() =>
                page
                    .locator('video')
                    .first()
                    .evaluate((video) => video.style.transform)
            )
            .toBe('scale(0.8)');
        await expect
            .poll(() =>
                page
                    .locator('video')
                    .nth(1)
                    .evaluate((video) => video.style.transform)
            )
            .toBe('');
        await worker.evaluate(async () => {
            const tabs = await chrome.tabs.query({});
            const tab = tabs.find((item) =>
                item.url?.startsWith('http://127.0.0.1:')
            );
            await chrome.scripting.executeScript({
                target: { tabId: tab!.id! },
                files: ['content.js'],
            });
            await chrome.storage.local.set({
                keystone: {
                    enabled: true,
                    vertical: 5,
                    horizontal: 0,
                    step: 0.1,
                },
            });
        });
        await expect
            .poll(() =>
                page
                    .locator('video')
                    .first()
                    .evaluate((video) => video.style.transform)
            )
            .toMatch(/^matrix3d/);
        await page.bringToFront();
        const popup = await context.newPage();
        await popup.goto(
            `chrome-extension://${new URL(worker.url()).host}/popup.html`
        );
        await expect(
            popup.getByRole('heading', { name: 'Keystone' })
        ).toBeVisible();
        await expect(
            popup.getByRole('slider', { name: 'Vertical', exact: true })
        ).toHaveValue('5');
        await popup
            .getByRole('slider', { name: 'Vertical', exact: true })
            .fill('8');
        await expect
            .poll(() =>
                worker.evaluate(
                    async () =>
                        (
                            (await chrome.storage.local.get('keystone'))
                                .keystone as { vertical: number }
                        ).vertical
                )
            )
            .toBe(8);
        await popup
            .getByRole('button', { name: 'Reset vertical', exact: true })
            .click();
        await expect(
            popup.getByRole('slider', { name: 'Vertical', exact: true })
        ).toHaveValue('0');
        expect(errors).toEqual([]);
    } finally {
        await context.close();
        await new Promise<void>((done) => server.close(() => done()));
    }
});
