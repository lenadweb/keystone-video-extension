import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'vite';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');

await rm(dist, { recursive: true, force: true });

const watchers = await Promise.all([
    build({
        configFile: resolve(root, 'vite.config.ts'),
        mode: 'development',
        build: { watch: {} },
    }),
    build({
        configFile: resolve(root, 'vite.content.config.ts'),
        mode: 'development',
        build: { watch: {} },
    }),
]);

console.log('Keystone: watching popup, worker and content script');

const close = async () => {
    await Promise.all(
        watchers.map((watcher) => watcher?.close?.()).filter(Boolean)
    );
    process.exit(0);
};

process.on('SIGINT', () => {
    close().catch(console.error);
});
process.on('SIGTERM', () => {
    close().catch(console.error);
});
