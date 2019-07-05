import React from "react";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";

import {
  isExplained,
  getRankingPlot,
  getAllFeaturesPlot,
  getFeaturePlot
} from "../../redux/bias/selectors";
import { view, selectFeature } from "../../redux/bias/reducer";

import Configure from "./Configure";
import UnconnectedPlotRanking from "../plots/PlotRanking";
import UnconnectedPlotAllFeatures from "../plots/PlotAllFeatures";
import UnconnectedPlotFeature from "../plots/PlotFeature";

const PlotRanking = connect(
  state => ({
    plot: getRankingPlot(state),
  }),
  { selectFeature }
)(UnconnectedPlotRanking);

const PlotAllFeatures = connect(
  state => ({
    plot: getAllFeaturesPlot(state),
  })
)(UnconnectedPlotAllFeatures);

const PlotFeature = connect(
  state => ({
    plot: getFeaturePlot(state),
  })
)(UnconnectedPlotFeature);

class Bias extends React.Component {
  componentDidMount() {
    this.props.view();
  }

  render() {
    if (!this.props.isExplained) {
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

    return (
      <>
        <div className="config">
          <Configure />
        </div>
        <div className="plots">
          <div className="ranking">
            <PlotRanking />
          </div>
          <div className="features">
            <PlotAllFeatures />
            <PlotFeature />
          </div>
        </div>
      </>
    );
  }
}

export default connect(
  state => ({
    isExplained: isExplained(state),
  }),
  { view }
)(Bias);
