import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const rootDir = resolve(import.meta.dirname, 'src');
const outDir = resolve(import.meta.dirname, 'dist');

export default defineConfig(({ mode }) => ({
    publicDir: false,
    resolve: {
        alias: {
            src: rootDir,
        },
    },
    build: {
        outDir,
        emptyOutDir: false,
        target: 'chrome120',
        sourcemap: mode === 'development' ? 'inline' : false,
        minify: mode === 'production',
        lib: {
            entry: resolve(rootDir, 'content/index.ts'),
            formats: ['iife'],
            name: 'KeystoneContent',
            fileName: () => 'content.js',
        },
    },
}));
