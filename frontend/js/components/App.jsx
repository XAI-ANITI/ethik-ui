import React from "react";
import { connect } from "react-redux";

import { getName as getDatasetName } from "../redux/dataset/selectors";
import Header from "./Header";
import LoadDataset from "./LoadDataset";
import ExplainWithMean from "./ExplainWithMean";
import DisplayMeanExplanation from "./DisplayMeanExplanation";
import PlotMeanExplanation from "./PlotMeanExplanation";

function App(props) {
  return (
    <div id="app">
      <Header />
      {!props.isDatasetLoaded &&
        <LoadDataset mimeTypes={["text/csv"]}>
          <p>Drag and drop a CSV file or click to select one.</p>
        </LoadDataset>
      }
      <ExplainWithMean endpoint="explain_with_mean" />
      <DisplayMeanExplanation />
      <PlotMeanExplanation />
    </div>
  );
}

export default connect(
  state => ({ isDatasetLoaded: getDatasetName(state) != "" }),
)(App);
