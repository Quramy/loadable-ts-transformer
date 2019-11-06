import ts from 'typescript';

export function getImportArg(callNode: ts.CallExpression): ts.Expression {
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

function visitEachLeadingComments(node: ts.Node, cb: (comment: ts.CommentRange & { text: string }) => void | boolean) {
  const src = node.getSourceFile();
  // const text = src.getFullText();
  const text = node.getFullText();
  const ranges = ts.getLeadingCommentRanges(text, 0);
  if (!ranges) return [] as string[];
  const ret: string[] = [];
  for (const range of ranges) {
    const comment = {
      ...range,
      text: text.slice(range.pos, range.end),
    };
    if (cb(comment) === false) break;
  }
  return node;
}

export function getLeadingComments(node: ts.Node) {
  const ret: string[] = [];
  visitEachLeadingComments(node, comment => {
    if (comment.kind === ts.SyntaxKind.SingleLineCommentTrivia) {
      ret.push(comment.text.slice(2));
    } else if (comment.kind == ts.SyntaxKind.MultiLineCommentTrivia) {
      ret.push(comment.text.slice(2, comment.text.length - 2));
    }
  });
  return ret;
}

export function removeMatchingLeadingComments(node: ts.Node, ctx: ts.TransformationContext, condition: RegExp) {
  return visitEachLeadingComments(node, comment => {
    if (condition.test(comment.text)) {
      const w = node.getLeadingTriviaWidth();
      const removeComment = (x: ts.Node): ts.Node => {
        if (x.getFullStart() === node.getFullStart()) {
          ts.setTextRange(x, { pos: x.getStart(), end: x.getEnd() });
        }
        return ts.visitEachChild(x, removeComment, ctx);
      };
      ts.visitEachChild(node, removeComment, ctx);
      const head = node.getSourceFile().text.slice(0, node.getFullStart());
      const tail = node.getSourceFile().text.slice(node.getStart());
      node.getSourceFile().text = head + ''.padStart(w) + tail;
      ts.setTextRange(node, { pos: node.getStart(), end: node.getEnd() });
      return false;
    }
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
