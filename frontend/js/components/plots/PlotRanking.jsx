import React from "react";

import ResponsivePlot from "./ResponsivePlot";

export default (props) => {
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
};
