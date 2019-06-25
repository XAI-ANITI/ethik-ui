import React from "react";

import Header from "./Header";
import Dataset from "./dataset/Dataset";
import Predictions from "./predictions/Predictions";

function App(props) {
  return (
    <div id="app">
      <Header />
      <Dataset />
      <Predictions />
    </div>
  );
}

export default App;
