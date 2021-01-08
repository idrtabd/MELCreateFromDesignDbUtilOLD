import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { render } from "react-dom";
import App from "./App";
import { BrowserRouter, HashRouter, Switch, Route } from "react-router-dom";
import Store from "./Store";

const Index = () => {
  return (
    <Store>
      <HashRouter>
        <App />
      </HashRouter>
    </Store>
  );
};
render(<Index />, document.getElementById("root"));
