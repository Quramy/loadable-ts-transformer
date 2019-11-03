import ts from "typescript";

export default function requireAsyncProperty(funcNode: ts.ArrowFunction | ts.FunctionExpression) {
  return ts.createPropertyAssignment(
    "requireAsync",
    funcNode,
  );
}
