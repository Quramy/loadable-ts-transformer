import ts from 'typescript';

export type CreatePropertyOptions = {
  ctx: ts.TransformationContext;
  callNode: ts.CallExpression;
  funcNode: ts.ArrowFunction | ts.FunctionExpression;
};
