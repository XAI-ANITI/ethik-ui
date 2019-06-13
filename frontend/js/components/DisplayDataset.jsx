import React from "react";
import { connect } from "react-redux"

import { getName } from "../redux/dataset/selectors";

function DisplayDataset(props) {
  if (!props.name) return null;
  return (
    <span>
      Dataset: {props.name}
    </span>
  );
}

export default connect(
  state => ({ name: getName(state) })
)(DisplayDataset);
