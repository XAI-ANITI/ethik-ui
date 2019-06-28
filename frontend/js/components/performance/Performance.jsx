require("../../../sass/Performance.scss");

import React from "react";
import { connect } from "react-redux";

import { isCurrentView } from "../../redux/app/selectors";

function Performance(props) {
  if (!props.isViewed) {
    return null;
  }

  return (
    <div id="performance">
      "performance"
    </div>
  );
}

export default connect(
  state => ({
    isViewed: isCurrentView(state, "PERFORMANCE"), 
  }),
)(Performance);
