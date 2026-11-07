import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { launchExtension } from './browser.mjs';
import { serveFixture } from './fixture-server.mjs';
import { capturePopup } from './capture-popup.mjs';

await mkdir('store/assets', { recursive: true });
await mkdir('docs/images', { recursive: true });
const fixture = await serveFixture();
const { context, worker } = await launchExtension();
try {
    const page = await context.newPage();
    await page.goto(fixture.url);
    await page.waitForFunction(
        () => document.querySelector('video')?.readyState >= 2
    );
    const shots = [
        {
            name: '01-vertical',
            title: 'Square up your video.',
            detail: 'Vertical correction',
            vertical: 12,
            horizontal: 0,
            enabled: true,
            caption: 'A little below the screen? Narrow the top.',
        },
        {
            name: '02-horizontal',
            title: 'Off to the side? All right.',
            detail: 'Horizontal correction',
            vertical: 0,
            horizontal: 12,
            enabled: true,
            caption: 'Correct a projector placed beside the screen.',
        },
        {
            name: '03-both-axes',
            title: 'Find your angle.',
            detail: 'Both axes, one setup',
            vertical: 8,
            horizontal: -6,
            enabled: true,
            caption: 'Combine vertical and horizontal correction.',
        },
        {
            name: '04-fine-control',
            title: 'Make the last small adjustment.',
            detail: 'Fine control',
            vertical: 6.5,
            horizontal: 3,
            enabled: true,
            caption: 'Set your step. Fine-tune with buttons or shortcuts.',
            step: 0.5,
        },
        {
            name: '05-toggle',
            title: 'Your setup, remembered.',
            detail: 'One switch to restore the original',
            vertical: 12,
            horizontal: 0,
            enabled: false,
            caption: 'Turn correction off without losing your values.',
        },
    ];
    for (const shot of shots) {
        await worker.evaluate(
            (settings) => chrome.storage.local.set({ keystone: settings }),
            {
                enabled: shot.enabled,
                vertical: shot.vertical,
                horizontal: shot.horizontal,
                step: shot.step ?? 0.1,
            }
        );
        await page.evaluate(({ title, detail, caption }) => {
            document.querySelector('header strong').textContent = title;
            document.querySelector('header span').textContent =
                `Keystone / ${detail}`;
            document.querySelector('h1').textContent = caption;
            document.querySelector('footer p').textContent =
                'Original local video. Actual Keystone interface.';
        }, shot);
        await page.waitForFunction(
            (enabled) =>
                document
                    .querySelector('video')
                    .style.transform.startsWith('matrix3d') === enabled,
            shot.enabled
        );
        const popup = await capturePopup(context, worker, page);
        if (shot.name === '01-vertical')
            await writeFile('docs/images/popup.png', popup);
        const popupMeta = await sharp(popup).metadata();
        const mask = Buffer.from(
            `<svg width="360" height="${popupMeta.height}"><rect width="360" height="${popupMeta.height}" rx="16" fill="white"/></svg>`
        );
        const rounded = await sharp(popup)
            .composite([{ input: mask, blend: 'dest-in' }])
            .png()
            .toBuffer();
        const scene = await page.screenshot();
        const result = await sharp(scene)
            .composite([{ input: rounded, left: 888, top: 136 }])
            .removeAlpha()
            .png()
            .toBuffer();
        await writeFile(`store/assets/${shot.name}.png`, result);
        if (shot.name === '01-vertical')
            await writeFile('docs/images/hero.png', result);
    }
} finally {
    await context.close();
    await fixture.close();
}

const logo = (await readFile('src/assets/icons/logo.svg', 'utf8')).replace(
    /<svg[^>]*>/,
    '<svg x="0" y="0" width="108" height="108" viewBox="0 0 108 108">'
);
const symbol = (x, y, size) =>
    `<g transform="translate(${x} ${y}) scale(${size / 108})">${logo}</g>`;
const diagram = (x, y, scale) =>
    `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M40 0H240L280 180H0Z" fill="#698AD3"/><rect x="34" y="30" width="212" height="120" rx="14" fill="#DCE5FF"/><path d="M119 65L160 90L119 115Z" fill="#2563EB"/></g>`;
const tiles = [
    {
        name: 'promo-small',
        width: 440,
        height: 280,
        body: `${symbol(34, 86, 108)}${diagram(205, 77, 0.7)}`,
    },
    {
        name: 'promo-marquee',
        width: 1400,
        height: 560,
        body: `${symbol(115, 145, 270)}${diagram(720, 130, 1.7)}<path d="M487 280H611M586 255L611 280L586 305" stroke="#AFC6FF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    },
];
for (const { name, width, height, body } of tiles) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#101D3B"/>${body}</svg>`;
    await writeFile(`docs/brand/${name}.svg`, `${svg}\n`);
    await sharp(Buffer.from(svg))
        .removeAlpha()
        .png()
        .toFile(`store/assets/${name}.png`);
}
const popup = await sharp('docs/images/popup.png')
    .resize({ height: 530 })
    .png()
    .toBuffer();
const font = await readFile('src/assets/fonts/Manrope-VariableFont_wght.ttf');
const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640"><defs><style>@font-face{font-family:Manrope;src:url(data:font/ttf;base64,${font.toString('base64')})}text{font-family:Manrope,sans-serif}</style></defs><rect width="1280" height="640" fill="#DCE5FF"/>${symbol(72, 64, 80)}<text x="172" y="117" fill="#172554" font-size="38" font-weight="600">Keystone</text><text x="72" y="280" fill="#172554" font-size="62" font-weight="600">Square up</text><text x="72" y="360" fill="#172554" font-size="62" font-weight="600">your video.</text><text x="76" y="440" fill="#344D83" font-size="24">Keep your projector where it fits.</text><text x="76" y="562" fill="#344D83" font-size="20">Video perspective correction for Chrome</text></svg>`;
await sharp(Buffer.from(social))
    .composite([{ input: popup, left: 855, top: 55 }])
    .removeAlpha()
    .png()
    .toFile('store/assets/social-1280x640.png');
console.log(
    'Captured five real-extension screenshots, README images, store tiles and social preview.'
);
