import React from "react";
import { connect } from "react-redux";

import ResponsivePlot from "../ResponsivePlot";
import { getAllFeaturesPlot } from "../../redux/performance/selectors";

function PlotAllFeatures(props) {
  return (
    <ResponsivePlot
      plot={props.plot}
    />
  );
}

export default connect(
  state => ({
    plot: getAllFeaturesPlot(state),
  })
)(PlotAllFeatures);
