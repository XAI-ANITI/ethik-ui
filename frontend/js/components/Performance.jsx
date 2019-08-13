import React from "react";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";
import Popup from "react-popup";

import {
  isExplained,
  getRankingPlot,
  getAllFeaturesPlot,
  getFeaturePlot
} from "../redux/performance/selectors";
import { view, selectFeature } from "../redux/performance/reducer";

import UnconnectedPlotRanking from "./plots/PlotRanking";
import UnconnectedPlotAllFeatures from "./plots/PlotAllFeatures";
import UnconnectedPlotFeature from "./plots/PlotFeature";

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

class Performance extends React.Component {
  componentDidMount() {
    this.props.view();
  }

  showRankingHelp = (e) => {
    e.preventDefault();
    Popup.create({
      title: "Help",
      content: (
        <div>
        Ranking
        </div>
      ),
    });
  };

  showNumericFeaturesHelp = (e) => {
    e.preventDefault();
    Popup.create({
      title: "Help",
      content: (
        <div>
        Numeric features
        </div>
      ),
    });
  };

  showSingleFeatureHelp = (e) => {
    e.preventDefault();
    Popup.create({
      title: "Help",
      content: (
        <div>
        Single feature
        </div>
      ),
    });
  };

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
        <Popup
          title="Help"
          className="mm-popup"
          btnClass="mm-popup__btn"
          closeBtn={true}
          escToClose={true}
        />
        <div className="plots">
          <div className="ranking plot_wrapper">
            <div className="help_icon">
              <a href="#" onClick={this.showRankingHelp}>
                <FontAwesome name="question-circle" />
              </a>
            </div>
            <PlotRanking />
          </div>
          <p className="help ranking_help">Click on bars to show details.</p>
          <div className="features">
            <div className="plot_wrapper">
              <div className="help_icon">
                <a href="#" onClick={this.showNumericFeaturesHelp}>
                  <FontAwesome name="question-circle" />
                </a>
              </div>
              <PlotAllFeatures />
            </div>
            <div className="plot_wrapper">
              <div className="help_icon">
                <a href="#" onClick={this.showSingleFeatureHelp}>
                  <FontAwesome name="question-circle" />
                </a>
              </div>
              <PlotFeature />
            </div>
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
)(Performance);
