import React, { Component } from "react";
import { connect } from "react-redux"

import { getName } from "../redux/dataset/selectors";

function DisplayDataset(props) {
  return (
    <div className="dataset">
      {props.name}
    </div>
  );
}

export default connect(
  state => ({ name: getName(state) })
)(DisplayDataset);
