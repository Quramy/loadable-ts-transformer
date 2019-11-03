import ts from 'typescript';

const template = `x = {
  requireSync(props) {
    const id = this.resolve(props);

    if (typeof __webpack_require__ !== 'undefined') {
      return __webpack_require__(id);
    }

    return eval('module.require')(id);
  }
}`;

export default function requireSyncProperty(): ts.ObjectLiteralElementLike {
  const tmp = ts.createSourceFile('', template, ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
  return (((tmp.statements[0] as ts.ExpressionStatement).expression as ts.BinaryExpression)
    .right as ts.ObjectLiteralExpression).properties[0];
}
