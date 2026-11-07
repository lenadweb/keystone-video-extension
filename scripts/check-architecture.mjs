import { readdir, readFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import ts from 'typescript';

const collectFiles = async (directory) => {
    const groups = await Promise.all(
        (await readdir(directory, { withFileTypes: true })).map((entry) => {
            const path = `${directory}/${entry.name}`;
            return entry.isDirectory()
                ? collectFiles(path)
                : /\.tsx?$/.test(path)
                  ? [path]
                  : [];
        })
    );
    return groups.flat();
};
const files = await collectFiles('src');
const graph = new Map();
const failures = [];
const runtimeLayers =
    /\/(?:services|hooks|controllers|dom|components|injected)\//;
const browserGlobals = new Set(['chrome', 'window', 'document', 'navigator']);
const sourceRoot = resolve('src');
for (const path of files) {
    const source = ts.createSourceFile(
        path,
        await readFile(path, 'utf8'),
        ts.ScriptTarget.Latest,
        true
    );
    const edges = [];
    const feature = path.split('/')[1];
    const types = path.includes('/types/');
    const utils = path.includes('/utils/');
    const injected = path.includes('/injected/');
    const fail = (message) => failures.push(`${path}: ${message}`);
    for (const node of source.statements) {
        if (
            (ts.isTypeAliasDeclaration(node) ||
                ts.isInterfaceDeclaration(node)) &&
            !types
        )
            fail('declare types in types/');
        if (ts.isEnumDeclaration(node) && !path.includes('/enums/'))
            fail('declare enums in enums/');
        if (ts.isVariableStatement(node) && !path.includes('/constants/')) {
            for (const declaration of node.declarationList.declarations) {
                if (
                    ts.isIdentifier(declaration.name) &&
                    /^[A-Z][A-Z_\d]+$/.test(declaration.name.text)
                )
                    fail('declare static configuration in constants/');
            }
        }
        if (!ts.isImportDeclaration(node)) continue;
        const specifier = node.moduleSpecifier.text;
        const clause = node.importClause;
        const typeOnly =
            clause?.isTypeOnly ||
            (clause?.namedBindings &&
                ts.isNamedImports(clause.namedBindings) &&
                !clause.name &&
                clause.namedBindings.elements.every((item) => item.isTypeOnly));
        if ((types || injected) && !typeOnly)
            fail('types/ and injected/ accept only type imports');
        const target = specifier.startsWith('src/')
            ? resolve(specifier)
            : specifier.startsWith('.')
              ? resolve(dirname(path), specifier)
              : null;
        if (!target || !target.startsWith(`${sourceRoot}/`)) continue;
        const normalized = `src/${relative(sourceRoot, target)}`;
        const dependencyFeature = normalized.split('/')[1];
        if (
            dependencyFeature !== feature &&
            dependencyFeature !== 'shared' &&
            dependencyFeature !== 'assets'
        )
            fail(`cross-feature import: ${specifier}`);
        if (utils && !typeOnly && runtimeLayers.test(normalized))
            fail(`pure utility depends on a runtime layer: ${specifier}`);
        const dependency = files.find(
            (file) =>
                file === normalized ||
                file === `${normalized}.ts` ||
                file === `${normalized}.tsx`
        );
        if (dependency) edges.push(dependency);
    }
    if (utils) {
        const inspect = (node) => {
            if (ts.isIdentifier(node) && browserGlobals.has(node.text))
                fail(`pure utility reads browser global: ${node.text}`);
            ts.forEachChild(node, inspect);
        };
        inspect(source);
    }
    graph.set(path, edges);
}
const active = new Set();
const visited = new Set();
const visit = (path) => {
    if (active.has(path)) {
        failures.push(`Circular import: ${[...active, path].join(' -> ')}`);
        return;
    }
    if (visited.has(path)) return;
    active.add(path);
    for (const dependency of graph.get(path) ?? []) visit(dependency);
    active.delete(path);
    visited.add(path);
};
for (const path of files) visit(path);
if (failures.length) throw new Error([...new Set(failures)].join('\n'));
console.log(
    `Validated ${files.length} source modules: layer boundaries, separate declarations, browser-free utilities and acyclic imports.`
);
