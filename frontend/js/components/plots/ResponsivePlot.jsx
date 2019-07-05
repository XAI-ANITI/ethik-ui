import React from "react";
import Plot from "react-plotly.js";

function ResponsivePlot(props) {
  if (props.plot === null) {
    return null;
  }

  const layout = props.plot.get("layout").toJS();
  layout.width = undefined;
  layout.height = undefined;
  layout.autosize = true;

  return (
    <Plot
      data={props.plot.get("data").toJS()}
      layout={layout}
      onClick={props.handleClick}
      useResizeHandler={true}
      className="responsive_plot"
      style={props.style}
    />
  );
}

export default ResponsivePlot;
