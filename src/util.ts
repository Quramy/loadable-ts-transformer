import ts from "typescript";

export function getImportArg(callNode: ts.CallExpression): ts.Node {
  return callNode.arguments[0];
}

export function getLeadingComments(node: ts.Node) {
  const src = node.getSourceFile();
  const ranges = ts.getLeadingCommentRanges(src.getFullText(), node.pos);
  if (!ranges) return [] as string[];
  const ret: string[] = [];
  for (const range of ranges) {
    ret.push(src.getSourceFile().getFullText().slice(range.pos, range.end));
  }
  return ret.map(comment => {
    if (comment.startsWith("//")) return comment.slice(2);
    if (comment.startsWith("/*")) return comment.slice(2, comment.length - 2);
    throw new Error("Invalid comment");
  });
}
