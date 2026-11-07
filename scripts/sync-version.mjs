import { readFile, writeFile } from 'node:fs/promises';

const { version } = JSON.parse(await readFile('package.json', 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(
        'Chrome releases require a stable major.minor.patch version.'
    );
}
const path = 'public/manifest.json';
const manifest = JSON.parse(await readFile(path, 'utf8'));
manifest.version = version;
await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Manifest version: ${version}`);
