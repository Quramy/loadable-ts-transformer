import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <div>
    <h1>Home</h1>
    <nav>
      <ul>
        <li>
          <Link to="/about">About page</Link>
        </li>
      </ul>
    </nav>
  </div>
);
