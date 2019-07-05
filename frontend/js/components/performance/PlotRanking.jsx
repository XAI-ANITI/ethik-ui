import React from "react";
import { connect } from "react-redux";

import ResponsivePlot from "../ResponsivePlot";
import { getRankingPlot } from "../../redux/performance/selectors";
import { selectFeature } from "../../redux/performance/reducer";

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
