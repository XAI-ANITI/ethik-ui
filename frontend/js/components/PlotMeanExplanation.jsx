// https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change

import React from "react";
import { connect } from "react-redux";
import Plot from "react-plotly.js";
import Immutable from "immutable";

import { isDatasetExplained, getTaus, getMeans, getProportions, getAccuracies, getSelectedFeatures, getYPredName, getPlotMode, getOriginalMeans } from "../redux/mean_explainer/selectors";
import { PLOT_MODES } from "../redux/mean_explainer/shared";
import API from "../api";

class PlotMeanExplanation extends React.Component {
  state = {
    plots: null,
    prevFeatures: new Immutable.List(),
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.features.equals(state.prevFeatures)) {
      return {
        plots: null,
        prevFeatures: props.features,
      };
    }
    return null;
  }

  componentDidMount() {
    this._loadPlots(this.props.features);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.plots === null) {
      this._loadPlots(this.props.features);
    }
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  _loadPlots(features) {
    if (!features.size) {
      return;
    }

    const this_ = this;

    this._asyncRequest = API.post(this.props.endpoint, {
      features: features.toJS()
    })
    .then(function (res) {
      this_._asyncRequest = null;
      this_.setState({
        plots: {
          tau: res.data.tau_plot,
          features: res.data.feature_plots
        }
      });
    })
    .catch(function (e) {
      // TODO
      alert("Error: " + e);
    });
  }

  render() {
    if (this.state.plots === null) {
      // TODO: loader
      return null;
    }

    let featurePlots = [];
    for (let feat in this.state.plots.features) {
      featurePlots.push(
        <div key={feat} className="plot">
          <Plot
            data={this.state.plots.features[feat].data}
            layout={this.state.plots.features[feat].layout}
          />
        </div>
      );
    }

    return (
      <div className="plots">
        <div className="plot">
          <Plot
            data={this.state.plots.tau.data}
            layout={this.state.plots.tau.layout}
          />
        </div>
        {featurePlots}
      </div>
    );
  }
}

export default connect(
  state => ({
    features: getSelectedFeatures(state),
  })
)(PlotMeanExplanation);
