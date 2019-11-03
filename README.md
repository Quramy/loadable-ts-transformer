![](https://github.com/Quramy/loadable-ts-transformer/workflows/build/badge.svg)
# loadable-ts-transformer

A TypeScript custom transformer for server side rendering with [loadable-components](https://github.com/smooth-code/loadable-components) .

## Usage

First of all, you should read https://www.smooth-code.com/open-source/loadable-components/docs/server-side-rendering/ .

This transformer is an alternative option for ts-loader user. It works as well as `@loadable/babel-plugin` does.

### Install

```sh
$ npm install loadable-ts-transformer ts-loader webpack typescript -D
```

### Configure webpack

```js
/* webpack.config.js */
const { loadableTransformer } = require('loadable-ts-transformer');

module.exports = {
    ...
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            getCustomTransformers: () => ({ before: [loadableTransformer] }),
          },
        },
      ],
    },
    ...
};
```

**Remarks** This transformer compiles `import(...)` expression. So you should set tsconfig `--module` option to "ES2015" or "ESNext".

## License
MIT
