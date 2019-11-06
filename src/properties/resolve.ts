import ts from 'typescript';
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
    ts.createBlock(
      [
        ts.createReturn(
          ts.createConditional(
            ts.createPropertyAccess(ts.createIdentifier('require'), 'resolveWeak'),
            ts.createCall(ts.createPropertyAccess(ts.createIdentifier('require'), 'resolveWeak'), undefined, [id]),
            ts.createCall(
              ts.createCall(ts.createIdentifier('eval'), undefined, [ts.createStringLiteral('require.resolve')]),
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
