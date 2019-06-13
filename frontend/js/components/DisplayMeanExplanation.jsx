require("../../sass/DisplayMeanExplanation.scss");

import React from "react";
import { connect } from "react-redux";

import { getFeatures, getSelectedFeatures } from "../redux/mean_explainer/selectors";
import { selectFeatures } from "../redux/mean_explainer/reducer";

function DisplayMeanExplanation(props) {
  const handleChange = (e) => {
    const options = e.target.options;
    let value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    props.selectFeatures({
      features: value
    });
  }

  if (!props.features.size) {
    return null;
  }

  const options = props.features.map(feature => (
    <option key={feature} value={feature}>{feature}</option>
  ));
  const selectedFeatures = props.selectedFeatures.toJS();

  return (
    <div className="explanation-header">
      <label>
        Select a feature:
        <select multiple value={selectedFeatures} onChange={handleChange}>
          {options}
        </select>
      </label>
    </div>
  );
}

export default connect(
  state => ({
    features: getFeatures(state),
    selectedFeatures: getSelectedFeatures(state),
  }),
  { selectFeatures }
)(DisplayMeanExplanation);
