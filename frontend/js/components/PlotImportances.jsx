import React from "react";
import { connect } from "react-redux";
import Plot from "react-plotly.js";
import Immutable from "immutable";

import { getFeatureNames } from "../redux/mean_explainer/selectors";
import API from "../api";

class PlotImportances extends React.Component {
  state = {
    plot: null,
    prevFeatures: new Immutable.List(),
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.features.equals(state.prevFeatures)) {
      return {
        plot: null,
        prevFeatures: props.features,
      };
    }
    return null;
  }

  componentDidMount() {
    this._loadPlot(this.props.features);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.plot === null) {
      this._loadPlot(this.props.features);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  _loadPlot(features) {
    if (!features.size) {
      return;
    }

    const this_ = this;

    this._asyncRequest = API.post(this.props.endpoint)
    .then(function (res) {
      this_._asyncRequest = null;
      this_.setState({ plot: res.data });
    })
    .catch(function (e) {
      // TODO
      alert("Error: " + e);
    });
  }

  render() {
    if (this.state.plot === null) {
      // TODO: loader
      return null;
    }

    return (
      <div className="plot">
        <Plot
          data={this.state.plot.data}
          layout={this.state.plot.layout}
          onClick={(data) => console.log(data)}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    features: getFeatureNames(state),
  })
)(PlotImportances);
