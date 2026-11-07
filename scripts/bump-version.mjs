import { execFileSync } from 'node:child_process';

const type = process.argv[2] ?? 'patch';
if (!['patch', 'minor', 'major'].includes(type)) {
    throw new Error('Use patch, minor or major.');
}
if (!process.env.npm_execpath) throw new Error('Run npm run version:bump.');
execFileSync(
    process.execPath,
    [process.env.npm_execpath, 'version', type, '--no-git-tag-version'],
    { stdio: 'inherit' }
);
