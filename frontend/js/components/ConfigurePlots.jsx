import React from "react";
import { connect } from "react-redux";

import { getAllowedPlotModes, getPlotMode } from "../redux/explainer/selectors";
import { selectPlotMode } from "../redux/explainer/reducer";

function ConfigurePlots(props) {
  if (!props.allowedPlotModes || !props.plotMode || props.allowedPlotModes.size == 1) {
    return null;
  }

  const handleChange = (e) => props.selectPlotMode({ mode: e.target.value });
  const options = props.allowedPlotModes.map(
    mode => <option key={mode} value={mode}>{mode}</option>
  );
  return (
    <select value={props.plotMode} onChange={handleChange}>
      {options}
    </select>
  );
}

export default connect(
  state => ({
    allowedPlotModes: getAllowedPlotModes(state),
    plotMode: getPlotMode(state),
  }),
  { selectPlotMode }
)(ConfigurePlots);
