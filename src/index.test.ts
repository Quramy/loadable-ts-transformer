import ts from 'typescript';
import { loadableTransformer } from './';

function testPlugin(source: string) {
  return ts.transpileModule(source, {
    transformers: {
      before: [loadableTransformer],
    },
    compilerOptions: {
      jsx: ts.JsxEmit.React,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    },
  }).outputText;
}

describe('transformer', () => {
  describe('simple import', () => {
    it('should transform path into "chunk-friendly" name', () => {
      const result = testPlugin(`
        loadable(() => import('../foo/bar'))
      `);

      expect(result).toMatchSnapshot();
    });

    describe('with "webpackChunkName" comment', () => {
      it('should use it', () => {
        const result = testPlugin(`
          loadable(() => import(/* webpackChunkName: "ChunkA" */ './ModA'))
        `);

        expect(result).toMatchSnapshot();
      });

      it('should use it even if comment is separated by ","', () => {
        const result = testPlugin(`
          loadable(() => import(/* webpackPrefetch: true, webpackChunkName: "ChunkA" */ './ModA'))
        `);

        expect(result).toMatchSnapshot();
      });
    });
  });
});
