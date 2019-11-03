import ts from "typescript";

const template = `x = {
  isReady(props) {
    if (typeof __webpack_modules__ !== 'undefined') {
      return !!__webpack_modules__[this.resolve(props)];
    }

    return false;
  },
}`;

export default function isReadyProperty(): ts.ObjectLiteralElementLike {
  const tmp = ts.createSourceFile("", template, ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
  return (((tmp.statements[0] as ts.ExpressionStatement).expression as ts.BinaryExpression).right as ts.ObjectLiteralExpression).properties[0];
}
