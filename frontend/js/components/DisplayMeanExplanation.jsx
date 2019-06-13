require("../../sass/DisplayMeanExplanation.scss");

import React from "react";
import { connect } from "react-redux";
import Select from "react-select";

import { getFeatures, getSelectedFeatures } from "../redux/mean_explainer/selectors";
import { selectFeatures } from "../redux/mean_explainer/reducer";

function DisplayMeanExplanation(props) {
  const handleChange = (selected) => props.selectFeatures({
    features: selected.map(option => option.value)
  });

  if (!props.features.size) {
    return null;
  }

  const selectedFeatures = props.selectedFeatures.toJS();
  const options = props.features.map(f => ({ value: f, label: f })).toJS();
  const value = selectedFeatures.map(f => ({ value: f, label: f }));

  return (
    <div className="explanation-header">
      <Select
        value={value}
        onChange={handleChange}
        options={options}
        placeholder="Select features to plot"
        isMulti
        isSearchable
      />
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
