import React from "react";
import { connect } from "react-redux";
import Plot from "react-plotly.js";
import { schemePaired } from "d3-scale-chromatic";

import { isDatasetExplained, getTaus, getMeans, getAccuracies, getSelectedFeatures } from "../redux/mean_explainer/selectors";

function PlotMeanExplanation(props) {
  if (!props.selectedFeatures.size) {
    return null;
  }

  const colorscale = schemePaired;

  let i = 0;
  const allInOnePlotData = [];
  const plots = props.selectedFeatures.map(feature => {
    const means = props.means.get(feature).toJS();
    const accuracies = props.accuracies.get(feature).toJS();
    
    const plot = (
      <div key={feature} className="plot">
        <Plot
          data={[
            {
              x: means,
              y: accuracies,
              type: "scatter",
              mode: "lines+markers",
              marker: {
                color: colorscale[i]
              }
            }
          ]}
          layout={{
            margin: { t: 70, r: 50 },
            title: feature,
            xaxis: {
              title: `Mean ${feature} of the dataset`,
              zeroline: false,
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

    allInOnePlotData.push({
      x: props.taus.toJS(),
      y: accuracies,
      name: feature,
      type: "scatter",
      mode: "lines+markers",
      marker: {
        color: colorscale[i]
      }
    });

    i++;
    return plot;
  });

  return (
    <div className="plots">
      <div className="plot">
        <Plot
          data={allInOnePlotData}
          layout={{
            margin: { t: 70, r: 50 },
            showlegend: true,
            xaxis: {
              title: "tau",
              zeroline: false,
            },
            yaxis: {
              title: "Accuracy",
              range: [0, 1],
              showline: true,
            }
          }}
        />
      </div>
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
