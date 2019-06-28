import React from "react";
import { connect } from "react-redux";
import Plot from "react-plotly.js";

import { getAllFeaturesPlot, getSelectedLabel } from "../../redux/bias/selectors";

function PlotAllFeatures(props) {
  if (!props.plot) {
    return null;
  }
  return (
    <Plot
      data={props.plot.get("data").toJS()}
      layout={props.plot.get("layout").toJS()}
    />
  );
}

export default connect(
  state => ({
    plot: getAllFeaturesPlot(state),
  })
)(PlotAllFeatures);
