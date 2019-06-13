import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";

import { explain } from "../redux/mean_explainer/reducer";
import { isLoaded as isDatasetLoaded } from "../redux/dataset/selectors";
import { isDatasetExplained } from "../redux/mean_explainer/selectors";
import API from "../api";

function ExplainWithMean(props) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.isExplained || !props.isLoaded) {
      return;
    }

    setIsLoading(true);

    const form = new FormData();
    form.append("file", props.dataset.file);

    API.post(props.endpoint, form)
    .then(function (res) {
      props.explain({
        taus: res.data.taus,
        means: res.data.means,
        accuracies: res.data.accuracies,
        features: Object.keys(res.data.accuracies),
      });
      setIsLoading(false);
    })
    .catch(function (e) {
      // TODO
      alert("Error: " + e);
    });
  });

  if (props.isExplained || !props.isLoaded || !isLoading) {
    return null;
  }

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
