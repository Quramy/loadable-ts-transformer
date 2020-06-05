import React from "react";

import path from "path";
import { ChunkExtractor } from "@loadable/server";
import express from "express";

import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import Routes from "./routes";

const prjBase = process.cwd();

const extractor = new ChunkExtractor({
  entrypoints: ["main"],
  publicPath: "/assets/",
  statsFile: path.resolve(prjBase, "public/loadable-stats.json"),
});

const app = express();

const port = process.env.PORT || 3000;

const html = ({ content }: { content: string }) => `<!doctype html>
<html>
  <body>
    <div id="app">${content}</div>
    ${extractor.getScriptTags()}
  </body>
</html>`;

app.use("/assets", express.static(path.resolve(prjBase, "public")));

app.get("*", async (req, res) => {

  const context = {};
  const App = (
    <StaticRouter location={req.url} context={context}>
      <Routes />
    </StaticRouter>
  );

  const content = renderToString(
    extractor.collectChunks(
      App
    )
  );

  res.status(200).end(html({ content }));
});

app.listen(port, () => console.log(
  `React SSR server is now running on http://localhost:${port}`
));
