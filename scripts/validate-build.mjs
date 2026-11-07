import { access, readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';

const json = async (path) => JSON.parse(await readFile(path, 'utf8'));
const pkg = await json('package.json');
const manifest = await json('dist/manifest.json');
const messages = await json(
    `dist/_locales/${manifest.default_locale}/messages.json`
);
assert.equal(
    manifest.version,
    pkg.version,
    'Package and manifest versions differ'
);
assert.equal(manifest.manifest_version, 3);
assert.deepEqual([...manifest.permissions].sort(), ['scripting', 'storage']);
assert.ok(messages.appName.message.length <= 75);
assert.ok(messages.appDescription.message.length <= 132);
for (const value of Object.values(messages)) {
    assert.ok(typeof value.message === 'string' && value.message.length > 0);
}
const paths = [
    manifest.background.service_worker,
    manifest.action.default_popup,
    ...Object.values(manifest.icons),
    ...manifest.content_scripts.flatMap((entry) => entry.js),
    'licenses/Manrope-OFL.txt',
    'licenses/THIRD_PARTY_NOTICES.txt',
    'licenses/Keystone-MIT.txt',
];
await Promise.all(paths.map((path) => access(`dist/${path}`)));
const inspect = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const path = `${directory}/${entry.name}`;
        if (entry.isDirectory()) await inspect(path);
        else {
            assert.ok(!/\.map$/.test(path), `Unexpected source map: ${path}`);
            assert.ok(
                !/(?:^|\/)(?:\.env|node_modules|store|tests)(?:\/|$)/.test(path)
            );
            if (/\.(?:js|html|css)$/.test(path)) {
                const source = await readFile(path, 'utf8');
                assert.ok(
                    !source.includes('sourceMappingURL='),
                    `Embedded source map: ${path}`
                );
                assert.ok(!/https?:\/\/localhost[:/]/.test(source));
            }
        }
    }
};
await inspect('dist');
console.log(
    `Validated Keystone ${pkg.version}: manifest, assets, licenses and production files.`
);
