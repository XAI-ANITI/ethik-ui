import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";
import Select from "react-select";

import { explain } from "../redux/explainer/reducer";
import { isLoaded as isDatasetLoaded } from "../redux/dataset/selectors";
import { isDatasetExplained } from "../redux/explainer/selectors";
import API from "../api";

function SetupExplanation(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [yPredName, setYPredName] = useState(props.dataset.columns.get(-1));
  const [yName, setYName] = useState(null);

  const explain = () => {
    setIsLoading(true);

    const form = new FormData();
    form.append("file", props.dataset.file);
    form.append("yPredName", yPredName);
    form.append("yName", yName != null ? yName : "");

    API.post(props.endpoint, form)
    .then(function (res) {
      props.explain({
        featureNames: res.data.features,
        yName: res.data.y_name,
        yPredName: res.data.y_pred_name,
      });
      setIsLoading(false);
    })
    .catch(function (e) {
      // TODO
      alert("Errorrrrr: " + e);
    });
  };

  if (props.isExplained || !props.isLoaded) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="spinner">
        <FontAwesome
          name="spinner"
          size="4x"
          spin
        />
      </div>
    );
  }

  if (yName == yPredName) {
    setYName(null);
  }

  const optionsPred = props.dataset.columns.toJS().map(
    c => ({ value: c, label: c })
  );

  const options = props.dataset.columns.toJS().filter(col => col != yPredName).map(
    c => ({ value: c, label: c })
  );

  return (
    <form className="explain" onSubmit={explain}>
      <div>
        <label>Ŷ:</label>
        <Select
          value={{ value: yPredName, label: yPredName }}
          onChange={(sel) => setYPredName(sel.value)}
          options={optionsPred}
          className="Select"
          isSearchable
        />
      </div>
      
      <div>
        <label>Y:</label>
        <Select
          value={{ value: yName, label: yName }}
          onChange={(sel) => setYName(sel != null ? sel.value : null)}
          options={options}
          className="Select"
          isSearchable
          isClearable
        />
      </div>

      <input type="submit" value="Explain" />
    </form>
  );
}

SetupExplanation.propTypes = {
  endpoint: PropTypes.string.isRequired,
};

export default connect(
  state => ({
    dataset: state.dataset,
    isLoaded: isDatasetLoaded(state),
    isExplained: isDatasetExplained(state),
  }),
  { explain }
)(SetupExplanation);
