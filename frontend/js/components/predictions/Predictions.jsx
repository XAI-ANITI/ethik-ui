require("../../../sass/Predictions.scss");

import React from "react";
import { connect } from "react-redux";

import { isCurrentView } from "../../redux/app/selectors";

import Configure from "./Configure";
import PlotRanking from "./PlotRanking";
import PlotAllFeatures from "./PlotAllFeatures";
import PlotFeature from "./PlotFeature";

function Predictions(props) {
  if (!props.isViewed) {
    return null;
  }

  return (
    <div id="explainer">
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
  }),
)(Predictions);
