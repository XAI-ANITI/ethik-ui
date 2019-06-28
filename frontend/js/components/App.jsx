import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./Header";
import Dataset from "./dataset/Dataset";
import ConfigureDataset from "./dataset/Configure";
import LoadDataset from "./dataset/Load";
import Performance from "./performance/Performance";
import Bias from "./bias/Bias";

function App(props) {
  return (
    <Router>
      <Header />

      <Route path="/dataset/load" exact component={Index} />
      <Route path="/dataset/configure" exact component={Index} />

      <Dataset />
      <Bias />
      <Performance />
    </Router>
  );
}

export default App;
