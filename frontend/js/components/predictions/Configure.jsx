import React from "react";
import { connect } from "react-redux";

import { getPredLabelsCols } from "../../redux/dataset/selectors";
import { getSelectedLabel } from "../../redux/predictions/selectors";
import { selectLabel } from "../../redux/predictions/reducer";

function Configure(props) {
  const handleChange = (e) => props.selectLabel({ label: e.target.value });
  return (
    <div>
      {props.labels.size > 1 && props.selectedLabel &&
        <select value={props.selectedLabel} onChange={handleChange}>
          {props.labels.map(
            label => <option key={label} value={label}>{label}</option>
          )}
        </select>
      }
    </div>
  );
}

export default connect(
  state => ({
    labels: getPredLabelsCols(state),
    selectedLabel: getSelectedLabel(state),
  }),
  { selectLabel }
)(Configure);
