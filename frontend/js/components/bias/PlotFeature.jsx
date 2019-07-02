import React from "react";
import { connect } from "react-redux";

import ResponsivePlot from "../ResponsivePlot";
import { getFeaturePlot, getSelectedFeature, getSelectedLabel } from "../../redux/bias/selectors";

function PlotFeature(props) {
  return (
    <ResponsivePlot
      plot={props.plot}
    />
  );
}

export default connect(
  state => ({
    plot: getFeaturePlot(state),
  })
)(PlotFeature);
