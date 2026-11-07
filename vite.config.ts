import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

const rootDir = resolve(import.meta.dirname, 'src');
const outDir = resolve(import.meta.dirname, 'dist');

export default defineConfig(({ mode }) => ({
    root: rootDir,
    publicDir: resolve(import.meta.dirname, 'public'),
    resolve: {
        alias: {
            src: rootDir,
        },
    },
    plugins: [react(), tailwindcss(), svgr()],
    build: {
        outDir,
        emptyOutDir: mode !== 'development',
        modulePreload: false,
        assetsInlineLimit: 0,
        target: 'chrome120',
        sourcemap: mode === 'development' ? 'inline' : false,
        minify: mode === 'production',
        rolldownOptions: {
            input: {
                popup: resolve(rootDir, 'popup.html'),
                worker: resolve(rootDir, 'worker/index.ts'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: 'chunks/[name].js',
                assetFileNames: 'assets/[name][extname]',
            },
        },
    },
}));
