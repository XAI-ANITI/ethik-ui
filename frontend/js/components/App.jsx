import React from "react";

import Header from "./Header";
import Dataset from "./dataset/Dataset";
import Metric from "./metric/Metric";
import Bias from "./bias/Bias";

function App(props) {
  return (
    <div id="app">
      <Header />
      <Dataset />
      <Bias />
      <Metric />
    </div>
  );
}

export default App;
