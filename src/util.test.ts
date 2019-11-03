import ts from "typescript";
import { getLeadingComments } from "./util";

describe(getLeadingComments, () => {
  it("should extracts comment body with multiline comment", () => {
    const source = ts.createSourceFile("test", `
/**
* hoge
* bar
**/ foo
    `, ts.ScriptTarget.ESNext, true);
    const target = source.statements[0];
    const actual = getLeadingComments(target);
    expect(actual).toStrictEqual(["*\n* hoge\n* bar\n*"]);
  });

  it("should extracts comment body with single line comment", () => {
    const source = ts.createSourceFile("test", `
// hoge
// bar
foo;
    `, ts.ScriptTarget.ESNext, true);
    const target = source.statements[0];
    const actual = getLeadingComments(target);
    expect(actual).toStrictEqual([" hoge", " bar"]);
  });
});
