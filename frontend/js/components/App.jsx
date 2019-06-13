import React from "react";
import { connect } from "react-redux";

import { getName as getDatasetName } from "../redux/dataset/selectors";
import Header from "./Header";
import LoadDataset from "./LoadDataset";
import MeanExplainer from "./MeanExplainer";

function App(props) {
  return (
    <div id="app">
      <Header />
      {!props.isDatasetLoaded &&
        <LoadDataset mimeTypes={["text/csv"]}>
          <p>Drag and drop a CSV file or click to select one.</p>
        </LoadDataset>
      }
      {props.isDatasetLoaded &&
        <MeanExplainer />
      }
    </div>
  );
}

export default connect(
  state => ({ isDatasetLoaded: getDatasetName(state) != "" }),
)(App);
