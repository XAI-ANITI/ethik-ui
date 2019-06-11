import React from "react";

import DatasetLoader from "./DatasetLoader";
import DisplayMeanExplanation from "./DisplayMeanExplanation";

function App() {
  return (
    <div>
      <DatasetLoader endpoint="loadDataset" mimeTypes={["text/csv"]} />
      <DisplayMeanExplanation />
    </div>
  );
}

export default App;
