import { mkdir, readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = await readFile('src/assets/icons/logo.svg');
await mkdir('docs/brand', { recursive: true });
await mkdir('store/assets', { recursive: true });
for (const size of [16, 32, 48, 128]) {
    const artwork = size === 128 ? 96 : size;
    const icon = await sharp(source).resize(artwork, artwork).png().toBuffer();
    const padding = (size - artwork) / 2;
    await sharp({
        create: {
            width: size,
            height: size,
            channels: 4,
            background: '#00000000',
        },
    })
        .composite([{ input: icon, left: padding, top: padding }])
        .png()
        .toFile(`public/icons/${size}.png`);
}
await sharp(source).resize(512, 512).png().toFile('docs/brand/logo-512.png');
await sharp(source).resize(128, 128).png().toFile('docs/brand/logo-128.png');
await writeFile(
    'store/assets/icon-128.png',
    await readFile('public/icons/128.png')
);
const monochrome = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M38 26C35 26 32.5 28 31.8 31L21 74C20 78 23 82 27 82H81C85 82 88 78 87 74L76.2 31C75.5 28 73 26 70 26H38ZM40 38C36.7 38 34 40.7 34 44V62C34 65.3 36.7 68 40 68H68C71.3 68 74 65.3 74 62V44C74 40.7 71.3 38 68 38H40ZM50 45.5C49 44.9 48 45.6 48 46.8V59.2C48 60.4 49 61.1 50 60.5L60 54.3C61 53.7 61 52.3 60 51.7L50 45.5Z"/></svg>`;
await writeFile('docs/brand/mark-monochrome.svg', `${monochrome}\n`);
console.log(
    'Generated toolbar icons, padded store icon, large logo and monochrome mark.'
);
