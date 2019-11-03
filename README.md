# loadable-ts-transformer

A TypeScript custom transformer for server side rendering with [loadable-components](https://github.com/smooth-code/loadable-components) .

## Usage

```sh
$ npm install loaable-ts-transformer ts-loader webpack typescript -D
```

```js
/* webpack.config.js */
const { loadableTransformer } = require('/ts-loadable-transformer');

module.exports = {
    ...
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: "ts-loader",
          options: {
            getCustomTransformers: () => ({ before: [loadableTransformer] }),
          },
        },
      ],
    },
    ...
};
```

## License
MIT
