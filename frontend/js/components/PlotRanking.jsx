import React from "react";
import { connect } from "react-redux";
import Plot from "react-plotly.js";
import Immutable from "immutable";

import API from "../api";
import { getFeatureNames, getRankingPlot } from "../redux/explainer/selectors";
import { selectFeature } from "../redux/explainer/reducer";

function PlotRanking(props) {
  const handleClick = (data) => {
    if (!data.points.length) return;
    const feature = data.points[0].y;
    props.selectFeature({ feature });
  }

  if (props.traces === null) {
    return null;
  }

  return (
    <div className="plot">
      <Plot
        data={props.traces.toJS()}
        layout={{
          margin: { t: 70 },
          width: 400,
          height: 600, // TODO
          xaxis: {
            showline: true,
            zeroline: false,
            range: [0, 1],
            side: "top",
          },
          yaxis: {
            showline: true,
            zeroline: false,
          },
        }}
        onClick={handleClick}
      />
    </div>
  );
}

export default connect(
  state => ({
    traces: getRankingPlot(state),
  }),
  { selectFeature }
)(PlotRanking);
