import { readdir, readFile } from 'node:fs/promises';
import { commentRanges } from './source-comments.mjs';

const walk = async (directory) => {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(async (entry) => {
            const path = `${directory}/${entry.name}`;
            return entry.isDirectory() ? walk(path) : [path];
        })
    );
    return files.flat();
};
const files = [
    ...(await walk('src')),
    ...(await walk('scripts')),
    ...(await walk('tests')),
    ...(await readdir('.')).filter((file) => /\.(?:m?js|tsx?)$/.test(file)),
];
const failures = [];
for (const file of files) {
    const source = await readFile(file, 'utf8');
    const hasComments = /\.(?:m?js|tsx?)$/.test(file)
        ? commentRanges(source, file).length > 0
        : /\.(?:css|html|svg)$/.test(file) && /\/\*|<!--/.test(source);
    if (hasComments) failures.push(file);
}
if (failures.length)
    throw new Error(`Remove source comments: ${failures.join(', ')}`);
console.log('Source files contain no comments.');
