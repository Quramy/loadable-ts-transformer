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
    it('should work with template literal', () => {
      const result = testPlugin(`
        loadable(() => import(\`./ModA\`))
      `);

      expect(result).toMatchSnapshot();
    });

    it('should work with + concatenation', () => {
      const result = testPlugin(`
        loadable(() => import('./Mod' + 'A'))
      `);

      expect(result).toMatchSnapshot();
    });

    it('should work with * in name', () => {
      const result = testPlugin(`
        loadable(() => import(\`./foo*\`))
      `);

      expect(result).toMatchSnapshot();
    });

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

    describe('without "webpackChunkName" comment', () => {
      it('should add it', () => {
        const result = testPlugin(`
          loadable(() => import('./ModA'))
        `);

        expect(result).toMatchSnapshot();
      });
    });

    describe('in a complex promise', () => {
      it('should work', () => {
        const result = testPlugin(`
          loadable(() => timeout(import('./ModA'), 2000))
        `);

        expect(result).toMatchSnapshot();
      });
    });

    describe('with options', () => {
      it('should work', () => {
        const result = testPlugin(`
          loadable(() => import('./ModA'), { ssr: false }))
        `);

        expect(result).toMatchSnapshot();
      });
    });
  });
});
