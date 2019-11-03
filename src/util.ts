import ts from 'typescript';

export function getImportArg(callNode: ts.CallExpression): ts.Node {
  return callNode.arguments[0];
}

export function createObjectMethod(name: string, args: string[], block: ts.Block) {
  return ts.createMethod(
    [],
    [],
    undefined,
    name,
    undefined,
    [],
    args.map(name => ts.createParameter(undefined, undefined, undefined, name)),
    undefined,
    block,
  );
}

export function getLeadingComments(node: ts.Node) {
  const src = node.getSourceFile();
  const ranges = ts.getLeadingCommentRanges(src.getFullText(), node.pos);
  if (!ranges) return [] as string[];
  const ret: string[] = [];
  for (const range of ranges) {
    ret.push(
      src
        .getSourceFile()
        .getFullText()
        .slice(range.pos, range.end),
    );
  }
  return ret.map(comment => {
    if (comment.startsWith('//')) return comment.slice(2);
    if (comment.startsWith('/*')) return comment.slice(2, comment.length - 2);
    throw new Error('Invalid comment');
  });
}

export function emitGlobalFunction(ctx: ts.TransformationContext, helperKey: string, text: string) {
  const helpers = ctx.readEmitHelpers();
  if (helpers) {
    helpers.filter(helper => helper.name !== helperKey).forEach(helper => ctx.requestEmitHelper(helper));
  }
  ctx.requestEmitHelper({
    name: helperKey,
    priority: 0,
    scoped: false,
    text,
  });
}
