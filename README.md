# loadable-transformer-ts5

**Compatible with Typescript V5**

Changes added over [loadable-ts-transformer](https://github.com/Quramy/loadable-ts-transformer)

A TypeScript custom transformer for server side rendering with loadable-components.

## Usage

This transformer is an alternative option for ts-loader user. It works as well as `@loadable/babel-plugin` does.

### Install

```sh
$ npm install loadable-transformer-ts5 ts-loader webpack typescript -D
```

### Configure webpack

```js
/* webpack.config.js */
const { loadableTransformer } = require('loadable-transformer-ts5');

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
