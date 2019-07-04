import React from "react";
import { connect } from "react-redux";

import ResponsivePlot from "../ResponsivePlot";
import { getRankingPlot, getSelectedLabel } from "../../redux/bias/selectors";
import { selectFeature } from "../../redux/bias/reducer";

function PlotRanking(props) {
  const handleClick = (data) => {
    if (!data.points.length) return;
    const feature = data.points[0].y;
    props.selectFeature({ feature });
  }

  return (
    <ResponsivePlot
      plot={props.plot}
      handleClick={handleClick}
    />
  );
}

export default connect(
  state => ({
    plot: getRankingPlot(state),
  }),
  { selectFeature }
)(PlotRanking);
