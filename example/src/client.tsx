import React from "react";
import { loadableReady } from "@loadable/component"
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes";

function bootstrap() {
  const elm = document.getElementById("app");
  if (!elm) return;
  hydrate((
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  ), elm);
}

loadableReady(() => bootstrap());
