import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import ContextProviders from "./context";

import { BrowserRouter } from "react-router-dom";

// import ContextProviders from "./context";

ReactDOM.render(
  <BrowserRouter>
    <ContextProviders>
      <App />
    </ContextProviders>
  </BrowserRouter>,
  document.getElementById("root")
);
