require("../../sass/ExplainWithMean.scss");

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";

import { explain } from "../redux/mean_explainer/reducer";
import { isLoaded as isDatasetLoaded } from "../redux/dataset/selectors";
import { isDatasetExplained } from "../redux/mean_explainer/selectors";
import API from "../api";

class ExplainWithMean extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
};

  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  explain = () => {
    this.setState(state => ({
      loading: true
    }));

    const this_ = this;
    const explain = this.props.explain;
    const form = new FormData();
    form.append("file", this.props.dataset.file);

    API.post(this.props.endpoint, form)
    .then(function (res) {
      this_.props.explain({
        taus: res.data.taus,
        means: res.data.means,
        accuracies: res.data.accuracies,
        features: Object.keys(res.data.accuracies),
      });
      this_.setState(state => ({
        loading: false
      }));
    })
    .catch(function (e) {
      // TODO
      alert("Error: " + e);
    });
  }

  render() {
    if (this.props.isExplained || !this.props.isLoaded) {
      return null;
    }

    if (this.state.loading) {
      return (
        <div class="spinner">
          <FontAwesome
            name="spinner"
            size="4x"
            spin
          />
        </div>
      );
    }

    this.explain();
    return null;
  }
}

export default connect(
  state => ({
    dataset: state.dataset,
    isLoaded: isDatasetLoaded(state),
    isExplained: isDatasetExplained(state),
  }),
  { explain }
)(ExplainWithMean);
