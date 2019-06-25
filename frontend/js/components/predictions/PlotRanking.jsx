import React from "react";
import { connect } from "react-redux";
import Plot from "react-plotly.js";

import { getRankingPlot, getSelectedLabel } from "../../redux/predictions/selectors";
import { selectFeature } from "../../redux/predictions/reducer";

function PlotRanking(props) {
  const handleClick = (data) => {
    if (!data.points.length) return;
    const feature = data.points[0].y;
    props.selectFeature({ feature });
  }

  if (props.plot === null) {
    return null;
  }

  return (
    <Plot
      data={props.plot.get("data").toJS()}
      layout={props.plot.get("layout").toJS()}
      onClick={handleClick}
    />
  );
}

export default connect(
  state => ({
    plot: getRankingPlot(state),
  }),
  { selectFeature }
)(PlotRanking);
