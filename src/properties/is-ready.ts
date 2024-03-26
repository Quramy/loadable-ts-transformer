import ts from 'typescript';
import { createObjectMethod, emitGlobalFunction } from '../util';

const isReadyFunctionTemplate = `function __loadable_isReady__(self, props) {
  if (typeof __webpack_modules__ !== "undefined") {
    return !!__webpack_modules__[self.resolve(props)];
  }
  
  return false;
}`;

export default function isReadyProperty(ctx: ts.TransformationContext): ts.ObjectLiteralElementLike {
  emitGlobalFunction(ctx, 'loadable:isReadyHelper', isReadyFunctionTemplate);
  return createObjectMethod(
    'isReady',
    ['props'],
    ts.factory.createBlock(
      [
        ts.factory.createReturnStatement(
          ts.factory.createCallExpression(ts.factory.createIdentifier('__loadable_isReady__'), undefined, [
            ts.factory.createIdentifier('this'),
            ts.factory.createIdentifier('props'),
          ]),
        ),
      ],
      true,
    ),
  );
}
