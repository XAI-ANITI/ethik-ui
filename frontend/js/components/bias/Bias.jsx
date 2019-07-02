import React from "react";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";

import { isExplained } from "../../redux/bias/selectors";
import { view } from "../../redux/bias/reducer";

import Configure from "./Configure";
import PlotRanking from "./PlotRanking";
import PlotAllFeatures from "./PlotAllFeatures";
import PlotFeature from "./PlotFeature";

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
