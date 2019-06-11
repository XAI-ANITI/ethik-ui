import React from "react";
import { connect } from "react-redux";

import { getTaus } from "../redux/mean_explainer/selectors";

function DisplayMeanExplanation(props) {
  return (
    <div>
      {props.taus.join(", ")}
    </div>
  );
}

export default connect(
  state => ({ taus: getTaus(state) })
)(DisplayMeanExplanation);
