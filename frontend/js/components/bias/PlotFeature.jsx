import React from "react";
import { connect } from "react-redux";
import Plot from "react-plotly.js";

import { getFeaturePlot, getSelectedFeature, getSelectedLabel } from "../../redux/bias/selectors";

function PlotFeature(props) {
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
    plot: getFeaturePlot(state),
  })
)(PlotFeature);
