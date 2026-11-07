import ts from 'typescript';

export const commentRanges = (source, filename) => {
    const file = ts.createSourceFile(
        filename,
        source,
        ts.ScriptTarget.Latest,
        true
    );
    const ranges = new Map();
    const collect = (items = []) => {
        for (const range of items) ranges.set(range.pos, range);
    };
    const visit = (node) => {
        collect(ts.getLeadingCommentRanges(source, node.pos));
        collect(ts.getTrailingCommentRanges(source, node.end));
        node.getChildren(file).forEach(visit);
    };
    visit(file);
    return [...ranges.values()].sort((a, b) => a.pos - b.pos);
};
