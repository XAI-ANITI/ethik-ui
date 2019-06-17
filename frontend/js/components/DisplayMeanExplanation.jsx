import React from "react";
import { connect } from "react-redux";
import Select from "react-select";

import { getFeatureNames, getSelectedFeatures, getPlotMode, getAllowedPlotModes } from "../redux/mean_explainer/selectors";
import { selectFeatures, selectPlotMode } from "../redux/mean_explainer/reducer";

function DisplayMeanExplanation(props) {
  const handleFeaturesSelected = (selected) => props.selectFeatures({
    features: selected.map(option => option.value)
  });

  const handlePlotModeSelected = (selected) => props.selectPlotMode({
    plotMode: selected.value
  });

  if (!props.features.size) {
    return null;
  }

  const selectedFeatures = props.selectedFeatures.toJS();
  const featureOptions = props.features.map(f => ({ value: f, label: f })).toJS();
  const selectedFeatureOptions = selectedFeatures.map(f => ({ value: f, label: f }));

  const plotModeOptions = props.allowedPlotModes.toJS().map(
    value => ({ value, label: value })
  );

  return (
    <div className="explanation_header">
      <Select
        value={selectedFeatureOptions}
        onChange={handleFeaturesSelected}
        options={featureOptions}
        placeholder="Select features to plot"
        isMulti
        isSearchable
      />
      {plotModeOptions.length > 1 &&
        <Select
          value={{ value: props.plotMode, label: props.plotMode }}
          onChange={handlePlotModeSelected}
          options={plotModeOptions}
        />
      }
    </div>
  );
}

export default connect(
  state => ({
    features: getFeatureNames(state),
    selectedFeatures: getSelectedFeatures(state),
    plotMode: getPlotMode(state),
    allowedPlotModes: getAllowedPlotModes(state),
  }),
  { selectFeatures, selectPlotMode }
)(DisplayMeanExplanation);
