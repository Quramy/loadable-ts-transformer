import ts from 'typescript';
import { getLeadingComments, removeMatchingLeadingComments } from './util';

describe(getLeadingComments, () => {
  it('should extracts comment body with multiline comment', () => {
    const source = ts.createSourceFile(
      'test',
      `
/**
* hoge
* bar
**/ 'foo'
    `,
      ts.ScriptTarget.ESNext,
      true,
    );
    const target = source.statements[0];
    const actual = getLeadingComments(target);
    expect(actual).toStrictEqual(['*\n* hoge\n* bar\n*']);
  });

  it('should extracts comment body with single line comment', () => {
    const source = ts.createSourceFile(
      'test',
      `
// hoge
// bar
foo;
    `,
      ts.ScriptTarget.ESNext,
      true,
    );
    const target = source.statements[0];
    const actual = getLeadingComments(target);
    expect(actual).toStrictEqual([' hoge', ' bar']);
  });
});

describe(removeMatchingLeadingComments, () => {
  it("should remove leading comments if condition matches the comment's body", () => {
    const actual = ts.transpileModule('() =>/* hoge */ /* fuga */ x(y);', {
      compilerOptions: {
        target: ts.ScriptTarget.ESNext,
      },
      transformers: {
        before: [
          ctx => source => {
            const visitor = (node: ts.Node): ts.Node => {
              removeMatchingLeadingComments(node, ctx, /fuga/);
              return ts.visitEachChild(node, visitor, ctx);
            };
            return ts.visitEachChild(source, visitor, ctx);
          },
        ],
      },
    }).outputText;
    expect(actual.trim()).toBe('() => x(y);');
  });
});
