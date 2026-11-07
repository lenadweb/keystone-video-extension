import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

export const loadPromoTemplate = async (popup) => {
    const [template, font, logo] = await Promise.all([
        readFile('store/promo/template.html', 'utf8'),
        readFile('src/assets/fonts/Manrope-VariableFont_wght.ttf'),
        readFile('src/assets/icons/logo.svg'),
    ]);
    return template
        .replaceAll(
            '{{FONT}}',
            `data:font/ttf;base64,${font.toString('base64')}`
        )
        .replaceAll(
            '{{LOGO}}',
            `data:image/svg+xml;base64,${logo.toString('base64')}`
        )
        .replaceAll(
            '{{POPUP}}',
            `data:image/png;base64,${popup.toString('base64')}`
        );
};

export const renderPromo = async (
    context,
    template,
    { format, width, height }
) => {
    const page = await context.newPage();
    try {
        await page.setViewportSize({ width, height });
        await page.setContent(template.replaceAll('{{FORMAT}}', format));
        await page.evaluate(async () => {
            await document.fonts.ready;
            await Promise.all(
                [...document.images].map((image) => image.decode())
            );
        });
        const overflow = await page.evaluate(() => {
            const copy = document
                .querySelector('.copy')
                .getBoundingClientRect();
            const ui = document
                .querySelector('.interface')
                .getBoundingClientRect();
            return (
                copy.right > ui.left ||
                ui.bottom > innerHeight ||
                ui.right > innerWidth
            );
        });
        if (overflow) throw new Error(`Promo layout overflows: ${format}`);
        return await sharp(await page.screenshot())
            .removeAlpha()
            .png()
            .toBuffer();
    } finally {
        await page.close();
    }
};
