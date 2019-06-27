require("../../../sass/Predictions.scss");

import React from "react";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";

import { isCurrentView } from "../../redux/app/selectors";
import { isExplained } from "../../redux/predictions/selectors";

import Configure from "./Configure";
import PlotRanking from "./PlotRanking";
import PlotAllFeatures from "./PlotAllFeatures";
import PlotFeature from "./PlotFeature";

function Predictions(props) {
  if (!props.isViewed) {
    return null;
  }

  if (!props.isExplained) {
    return (
      <div id="predictions">
        <div className="spinner">
          <FontAwesome
            name="spinner"
            size="4x"
            spin
          />
        </div>
      </div>
    );
  }

  return (
    <div id="predictions">
      <div className="config">
        <Configure />
      </div>
      <div className="plots">
        <div className="ranking">
          <PlotRanking />
        </div>
        <div className="features">
          <PlotAllFeatures />
          <br />
          <PlotFeature />
        </div>
      </div>
    </div>
  );
}

export default connect(
  state => ({
    isViewed: isCurrentView(state, "PREDICTIONS"), 
    isExplained: isExplained(state),
  }),
)(Predictions);
