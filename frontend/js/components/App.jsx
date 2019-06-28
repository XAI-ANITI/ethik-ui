import React from "react";

import Header from "./Header";
import Dataset from "./dataset/Dataset";
import Performance from "./performance/Performance";
import Bias from "./bias/Bias";

function App(props) {
  return (
    <div id="app">
      <Header />
      <Dataset />
      <Bias />
      <Performance />
    </div>
  );
}

export default App;
