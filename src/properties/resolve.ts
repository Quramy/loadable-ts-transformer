import ts from "typescript";
import { getImportArg } from "../util";

const template = (ID: string) => `x = {
  resolve() {
    if (require.resolveWeak) {
      return require.resolveWeak(${ID});
    }

    return eval('require.resolve')(${ID});
  }
}`;

function getCallValue(callNode: ts.CallExpression) {
  const importArg = getImportArg(callNode);
  if (ts.isStringLiteral(importArg) || ts.isTemplateLiteral(importArg) || ts.isTemplateExpression(importArg)) {
    return importArg.getText();
  }
  throw new Error("invalid import argument");
}

export default function resolveProperty(callNode: ts.CallExpression) {
  const id = getCallValue(callNode);
  const tmp = ts.createSourceFile("", template(id), ts.ScriptTarget.ESNext, false, ts.ScriptKind.TS);
  return (((tmp.statements[0] as ts.ExpressionStatement).expression as ts.BinaryExpression).right as ts.ObjectLiteralExpression).properties[0];
}
