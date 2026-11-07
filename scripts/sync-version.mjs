import { readFile, writeFile } from 'node:fs/promises';
import { format, resolveConfig } from 'prettier';

const { version } = JSON.parse(await readFile('package.json', 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(
        'Chrome releases require a stable major.minor.patch version.'
    );
}
const path = 'public/manifest.json';
const manifest = JSON.parse(await readFile(path, 'utf8'));
manifest.version = version;
await writeFile(
    path,
    await format(JSON.stringify(manifest), {
        ...(await resolveConfig(path)),
        filepath: path,
    })
);
console.log(`Manifest version: ${version}`);
