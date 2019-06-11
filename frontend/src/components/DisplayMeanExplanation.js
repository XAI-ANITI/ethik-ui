import React from "react";
import { connect } from "react-redux";

import { getTaus } from "../redux/selectors";

function DisplayMeanExplanation(props) {
  return props.taus.join(", ");
}

export default connect(
  state => ({ taus: getTaus(state) })
)(DisplayMeanExplanation);
