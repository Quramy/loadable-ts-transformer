import ts from 'typescript';

export default function requireAsyncProperty(funcNode: ts.ArrowFunction | ts.FunctionExpression) {
  return ts.factory.createPropertyAssignment('requireAsync', funcNode);
}
