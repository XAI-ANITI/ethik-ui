require("../../sass/DisplayMeanExplanation.scss");

import React from "react";
import { connect } from "react-redux";

import { getFeatures } from "../redux/mean_explainer/selectors";
import { selectFeature } from "../redux/mean_explainer/reducer";

function DisplayMeanExplanation(props) {
  const handleChange = (e) => {
    props.selectFeature({
      feature: e.target.value
    });
  }

  if (!props.features.size) {
    return null;
  }

  const options = props.features.map(feature => (
    <option key={feature} value={feature}>{feature}</option>
  ));
  return (
    <div className="explanation-header">
      <label>
        Select a feature:
        <select value={props.selectedFeature} onChange={handleChange}>
          {options}
        </select>
      </label>
    </div>
  );
}

export default connect(
  state => ({ features: getFeatures(state) }),
  { selectFeature }
)(DisplayMeanExplanation);
