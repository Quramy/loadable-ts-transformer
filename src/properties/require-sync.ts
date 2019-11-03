import ts from 'typescript';

import { emitGlobalFunction, createObjectMethod } from '../util';

const requireSyncFunctionTemplate = `function __loadable_requireSync__(self, props) {
  var id = self.resolve(props);

  if (typeof __webpack_require__ !== 'undefined') {
    return __webpack_require__(id);
  }

  return eval('module.require')(id);
}`;

export default function requireSyncProperty(ctx: ts.TransformationContext): ts.ObjectLiteralElementLike {
  emitGlobalFunction(ctx, 'loadable:requireSyncHelper', requireSyncFunctionTemplate);
  return createObjectMethod(
    'requireSync',
    ['props'],
    ts.createBlock(
      [
        ts.createReturn(
          ts.createCall(ts.createIdentifier('__loadable_requireSync__'), undefined, [
            ts.createIdentifier('this'),
            ts.createIdentifier('props'),
          ]),
        ),
      ],
      true,
    ),
  );
}
