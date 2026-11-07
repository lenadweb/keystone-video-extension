import { copyFile, readFile, writeFile } from 'node:fs/promises';

const dependencies = [
    'react',
    'react-dom',
    'scheduler',
    'classnames',
    'lucide-react',
];
const notices = [
    'Keystone third-party notices',
    'Manrope is distributed under SIL OFL 1.1; see Manrope-OFL.txt.',
];
for (const name of dependencies) {
    const pkg = JSON.parse(
        await readFile(`node_modules/${name}/package.json`, 'utf8')
    );
    const license = await readFile(`node_modules/${name}/LICENSE`, 'utf8');
    notices.push(`${name} ${pkg.version}\n${license.trim()}`);
}
await writeFile(
    'public/licenses/THIRD_PARTY_NOTICES.txt',
    `${notices.join('\n\n')}\n`
);

await copyFile('LICENSE', 'public/licenses/Keystone-MIT.txt');
