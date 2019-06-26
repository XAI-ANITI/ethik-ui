import React from "react";

import Header from "./Header";
import Dataset from "./dataset/Dataset";
import Metric from "./metric/Metric";
import Predictions from "./predictions/Predictions";

function App(props) {
  return (
    <div id="app">
      <Header />
      <Dataset />
      <Predictions />
      <Metric />
    </div>
  );
}

export default App;
