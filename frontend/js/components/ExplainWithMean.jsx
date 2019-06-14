import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";

import { explain } from "../redux/mean_explainer/reducer";
import { isLoaded as isDatasetLoaded } from "../redux/dataset/selectors";
import { isDatasetExplained } from "../redux/mean_explainer/selectors";
import API from "../api";

function ExplainWithMean(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [yPredName, setYPredName] = useState(props.dataset.columns.get(-1));

  const explain = () => {
    setIsLoading(true);

    const form = new FormData();
    form.append("file", props.dataset.file);
    form.append("yPredName", yPredName);

    API.post(props.endpoint, form)
    .then(function (res) {
      props.explain({
        taus: res.data.taus,
        means: res.data.means,
        accuracies: res.data.accuracies,
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

  const options = props.dataset.columns.map(c =>
    <option key={c} value={c}>{c}</option>
  ).toJS();

  return (
    <form onSubmit={explain}>
      <label>
        Y pred name:
        <select value={yPredName} onChange={(e) => setYPredName(e.target.value)}>
          {options}
        </select>
      </label>
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
