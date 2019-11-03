import React from "react";
import { Route } from "react-router-dom";
import loadable from "@loadable/component";

const Home = loadable(() => import("./components/home"));
const About = loadable(() => import("./components/about"));

export default () => (
  <>
    <Route path="/" exact component={Home} />
    <Route path="/about" exact component={About} />
  </>
);
