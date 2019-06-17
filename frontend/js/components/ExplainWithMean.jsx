import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";
import Select from "react-select";

import { explain } from "../redux/mean_explainer/reducer";
import { isLoaded as isDatasetLoaded } from "../redux/dataset/selectors";
import { isDatasetExplained } from "../redux/mean_explainer/selectors";
import API from "../api";

function ExplainWithMean(props) {
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
        taus: res.data.taus,
        means: res.data.means,
        originalMeans: res.data.original_means,
        accuracies: res.data.accuracies,
        proportions: res.data.proportions,
        names: {
          features: res.data.names.X,
          y: res.data.names.y,
          yPred: res.data.names.y_pred,
        },
      });
      setIsLoading(false);
    })
    .catch(function (e) {
      // TODO
      alert("Error: " + e);
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
    <form id="explain_with_mean" onSubmit={explain}>
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

ExplainWithMean.propTypes = {
  endpoint: PropTypes.string.isRequired,
};

export default connect(
  state => ({
    dataset: state.dataset,
    isLoaded: isDatasetLoaded(state),
    isExplained: isDatasetExplained(state),
  }),
  { explain }
)(ExplainWithMean);
