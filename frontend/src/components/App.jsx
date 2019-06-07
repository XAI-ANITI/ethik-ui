import React from "react";

import DatasetLoader from "./DatasetLoader";

function App() {
  return (
    <DatasetLoader endpoint="loadDataset" mimeTypes={["text/csv"]} />
  );
}

export default App;
