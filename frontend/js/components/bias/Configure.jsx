import React from "react";
import { connect } from "react-redux";
import Select from "react-select";

import { getPredLabelsCols } from "../../redux/dataset/selectors";
import { getSelectedLabel } from "../../redux/bias/selectors";
import { selectLabel } from "../../redux/bias/reducer";

function Configure(props) {
  const handleChange = (sel) => props.selectLabel({ label: sel.value });
  return (props.labels.size > 1 && props.selectedLabel &&
    <>
      <label>Class:</label>
      <Select
        value={{ value: props.selectedLabel, label: props.selectedLabel }}
        onChange={handleChange}
        options={props.labels.toArray().map(
          label => ({ value: label, label: label })
        )}
        className="Select"
        isSearchable
      />
    </>
  );
}

export default connect(
  state => ({
    labels: getPredLabelsCols(state),
    selectedLabel: getSelectedLabel(state),
  }),
  { selectLabel }
)(Configure);
