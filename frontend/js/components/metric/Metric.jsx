require("../../../sass/Metric.scss");

import React from "react";
import { connect } from "react-redux";

import { isCurrentView } from "../../redux/app/selectors";

function Metric(props) {
  if (!props.isViewed) {
    return null;
  }

  return (
    <div id="metric">
      "metric"
    </div>
  );
}

export default connect(
  state => ({
    isViewed: isCurrentView(state, "METRIC"), 
  }),
)(Metric);
