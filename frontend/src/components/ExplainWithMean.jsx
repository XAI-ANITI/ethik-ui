import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { explain } from "../redux/mean_explainer/reducer";
import API from "../api";

class ExplainWithMean extends Component {
  static propTypes = {
    endpoint: PropTypes.string.isRequired,
};

  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  handleClick = () => {
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
    if (this.state.loading) {
      return (
        <div>Loading...</div>
      );
    }
    if (this.props.dataset.file) {
      return (
        <button onClick={this.handleClick}>
        Explain with means
        </button>
      );
    }
    return null;
  }
}

export default connect(
  state => ({ dataset: state.dataset }),
  { explain }
)(ExplainWithMean);
