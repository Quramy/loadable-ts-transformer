import ts, { SyntaxKind } from 'typescript';
import { getImportArg, createObjectMethod } from '../util';

function getCallValue(callNode: ts.CallExpression) {
  const importArg = getImportArg(callNode);
  if (
    ts.isBinaryExpression(importArg) ||
    ts.isStringLiteral(importArg) ||
    ts.isTemplateLiteral(importArg) ||
    ts.isTemplateExpression(importArg)
  ) {
    return importArg;
  }
  throw new Error('invalid import argument');
}

export default function resolveProperty(callNode: ts.CallExpression) {
  const id = getCallValue(callNode);
  return createObjectMethod(
    'resolve',
    [],
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createConditionalExpression(
            ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('require'), 'resolveWeak'),
            ts.factory.createToken(SyntaxKind.QuestionToken),
            ts.factory.createCallExpression(
              ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier('require'), 'resolveWeak'),
              undefined,
              [id],
            ),
            ts.factory.createToken(SyntaxKind.ColonToken),
            ts.factory.createCallExpression(
              ts.factory.createCallExpression(ts.factory.createIdentifier('eval'), undefined, [
                ts.factory.createStringLiteral('require.resolve'),
              ]),
              undefined,
              [id],
            ),
          ),
        ),
      ],
      true,
    ),
  );
}
