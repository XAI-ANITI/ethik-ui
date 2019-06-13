import React from "react";
import { connect } from "react-redux";
import Plot from "react-plotly.js";

import { isDatasetExplained, getTaus, getMeans, getAccuracies, getSelectedFeature } from "../redux/mean_explainer/selectors";

function PlotMeanExplanation(props) {
  if (!props.isDatasetExplained || !props.selectedFeature) {
    return null;
  }
  const means = props.means.get(props.selectedFeature).toJS();
  const accuracies = props.accuracies.get(props.selectedFeature).toJS();
  return (
    <div>
      <Plot
        data={[
          {
            x: means,
            y: accuracies,
            type: "scatter",
            mode: "lines+markers",
          }
        ]}
        layout={{
          margin: { t: 50 },
          xaxis: {
            title: `Mean ${props.selectedFeature} of the dataset`,
          },
          yaxis: {
            title: "Accuracy",
            range: [0, 1],
            showline: true,
          }
        }}
      />
    </div>
  );
}

export default connect(
  state => ({
    isDatasetExplained: isDatasetExplained(state),
    taus: getTaus(state),
    means: getMeans(state),
    accuracies: getAccuracies(state),
    selectedFeature: getSelectedFeature(state),
  })
)(PlotMeanExplanation);
