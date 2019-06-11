import React from "react";

import LoadDataset from "./LoadDataset";
import DisplayDataset from "./DisplayDataset";
import ExplainWithMean from "./ExplainWithMean";
import DisplayMeanExplanation from "./DisplayMeanExplanation";

function App() {
  return (
    <div>
      <LoadDataset mimeTypes={["text/csv"]} />
      <DisplayDataset />
      <ExplainWithMean endpoint="explain_with_mean" />
      <DisplayMeanExplanation />
    </div>
  );
}

export default App;
