import * as ts from 'typescript';
import chunkNameProperty from './properties/chunk-name';
import requireAsyncProperty from './properties/require-async';
import requireSyncProperty from './properties/require-sync';
import isReadyProperty from './properties/is-ready';
import resolveProperty from './properties/resolve';

function isLoadableNode(node: ts.Node): node is ts.CallExpression {
  if (!ts.isCallExpression(node)) return false;
  const identifier = node.expression;
  if (!ts.isIdentifier(identifier)) return false;
  if (identifier.text !== 'loadable') return false;
  return true;
}

function collectImports(loadableCallExpressionNode: ts.CallExpression, ctx: ts.TransformationContext) {
  const ret: ts.CallExpression[] = [];
  function visit(node: ts.Node): ts.Node {
    if (node.kind === ts.SyntaxKind.ImportKeyword) {
      ret.push(node.parent as ts.CallExpression);
      return node;
    }
    return ts.visitEachChild(node, visit, ctx);
  }
  ts.visitNodes(loadableCallExpressionNode.arguments, visit);
  return ret;
}

function getFuncNode(
  loadableCallExpressionNode: ts.CallExpression,
): ts.FunctionExpression | ts.ArrowFunction | undefined {
  const arg = loadableCallExpressionNode.arguments[0];
  if (!arg) return;
  if (!ts.isArrowFunction(arg) && !ts.isFunctionExpression(arg)) return;
  return arg;
}

export function loadableTransformer(ctx: ts.TransformationContext) {
  function visitNode(node: ts.Node): ts.Node {
    if (!isLoadableNode(node)) return ts.visitEachChild(node, visitNode, ctx);

    const funcNode = getFuncNode(node);
    if (!funcNode) return node;

    // Collect dynamic import call expressions such as `import('./foo')`
    const imports = collectImports(node, ctx);

    // Ignore loadable function that does not have any "import" call
    if (imports.length === 0) return node;

    // Multiple imports call is not supported
    if (imports.length > 1) {
      throw new Error('loadable: multiple import calls inside `loadable()` function are not supported.');
    }

    const [callNode] = imports;

    const obj = ts.factory.createObjectLiteralExpression(
      [
        chunkNameProperty({ ctx, callNode, funcNode }),
        isReadyProperty(ctx),
        requireAsyncProperty(funcNode),
        requireSyncProperty(ctx),
        resolveProperty(callNode),
      ],
      true,
    );
    return ts.factory.updateCallExpression(node, node.expression, undefined, [obj]);
  }

  return (source: ts.SourceFile) =>
    ts.factory.updateSourceFile(
      source,
      (ts.visitNodes(source.statements, visitNode) as unknown) as readonly ts.Statement[],
    );
}
