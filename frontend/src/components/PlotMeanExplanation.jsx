import React from "react";
import { connect } from "react-redux";
import Plot from "react-plotly.js";

import { getTaus, getMeans, getAccuracies, getSelectedFeature } from "../redux/mean_explainer/selectors";

function PlotMeanExplanation(props) {
  if (!props.selectedFeature) {
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
          xaxis: {
            title: `${props.selectedFeature} (mean)`
          },
          yaxis: {
            title: "Accuracy",
          }
        }}
      />
    </div>
  );
}

export default connect(
  state => ({
    taus: getTaus(state),
    means: getMeans(state),
    accuracies: getAccuracies(state),
    selectedFeature: getSelectedFeature(state),
  })
)(PlotMeanExplanation);
