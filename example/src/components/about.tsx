import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <div>
    <h1>This is about page</h1>
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </nav>
  </div>
);
