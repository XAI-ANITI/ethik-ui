import React from "react";
import { connect } from "react-redux";
import Plot from "react-plotly.js";
import { schemePaired } from "d3-scale-chromatic";

import { isDatasetExplained, getTaus, getMeans, getProportions, getAccuracies, getSelectedFeatures, getYPredName, getPlotMode } from "../redux/mean_explainer/selectors";
import { PLOT_MODES } from "../redux/mean_explainer/shared";

function PlotMeanExplanation(props) {
  if (!props.selectedFeatures.size) {
    return null;
  }

  const colorscale = schemePaired;
  const yData = (
    props.plotMode == PLOT_MODES.get("PROPORTIONS")
    ? props.proportions
    : props.accuracies
  );
  const yLabel = (
    props.plotMode == PLOT_MODES.get("PROPORTIONS")
    ? `Proportion of ${props.yPredName} = 1`
    : "Accuracy"
  );

  let i = 0;
  const allInOnePlotData = [];
  const plots = props.selectedFeatures.map(feature => {
    const means = props.means.get(feature).toJS();
    const y = yData.get(feature).toJS();
    
    const plot = (
      <div key={feature} className="plot">
        <Plot
          data={[
            {
              x: means,
              y: y,
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
              title: yLabel,
              range: [0, 1],
              showline: true,
              tickformat: "%",
            }
          }}
        />
      </div>
    );

    allInOnePlotData.push({
      x: props.taus.toJS(),
      y: y,
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
              title: yLabel,
              range: [0, 1],
              showline: true,
              tickformat: "%",
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
    proportions: getProportions(state),
    accuracies: getAccuracies(state),
    selectedFeatures: getSelectedFeatures(state),
    plotMode: getPlotMode(state),
    yPredName: getYPredName(state),
  })
)(PlotMeanExplanation);
