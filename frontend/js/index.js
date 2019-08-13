require("../sass/popup.scss");
require("../sass/main.scss");

import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux"
import store from "./redux/store"

import App from "./components/App";

const wrapper = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <App /> 
  </Provider>,
  wrapper
);
