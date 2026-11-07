import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { zipSync, unzipSync } from 'fflate';
import './validate-build.mjs';

const entries = {};
const collect = async (directory, prefix = '') => {
    for (const entry of (
        await readdir(directory, { withFileTypes: true })
    ).sort((a, b) => a.name.localeCompare(b.name))) {
        const name = `${prefix}${entry.name}`;
        const path = `${directory}/${entry.name}`;
        if (entry.isDirectory()) await collect(path, `${name}/`);
        else
            entries[name] = [
                new Uint8Array(await readFile(path)),
                { mtime: new Date(1980, 0, 1, 0, 0, 0) },
            ];
    }
};
await collect('dist');
const { version } = JSON.parse(await readFile('package.json', 'utf8'));
const name = `keystone-${version}-chrome.zip`;
const archive = zipSync(entries, { level: 9 });
const unpacked = unzipSync(archive);
for (const [path, [bytes]] of Object.entries(entries)) {
    if (!Buffer.from(unpacked[path]).equals(Buffer.from(bytes)))
        throw new Error(`ZIP mismatch: ${path}`);
}
await mkdir('release', { recursive: true });
await writeFile(`release/${name}`, archive);
await writeFile(
    `release/${name}.sha256`,
    `${createHash('sha256').update(archive).digest('hex')}  ${name}\n`
);
console.log(
    `Created release/${name} (${archive.length} bytes), verified every entry.`
);
