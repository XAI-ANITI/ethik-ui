import React from "react";
import { connect } from "react-redux";
import Plot from "react-plotly.js";

import { isDatasetExplained, getTaus, getMeans, getAccuracies, getSelectedFeatures } from "../redux/mean_explainer/selectors";

function PlotMeanExplanation(props) {
  if (!props.selectedFeatures.size) {
    return null;
  }

  const plots = props.selectedFeatures.map(feature => {
    const means = props.means.get(feature).toJS();
    const accuracies = props.accuracies.get(feature).toJS();
    
    return (
      <div key={feature} className="plot">
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
            margin: { t: 70, r: 50 },
            title: feature,
            xaxis: {
              title: `Mean ${feature} of the dataset`,
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
  });

  return (
    <div className="plots">
      {plots}
    </div>
  );
}

export default connect(
  state => ({
    taus: getTaus(state),
    means: getMeans(state),
    accuracies: getAccuracies(state),
    selectedFeatures: getSelectedFeatures(state),
  })
)(PlotMeanExplanation);
