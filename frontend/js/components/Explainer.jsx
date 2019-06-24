require("../../sass/Explainer.scss");
import React from "react";

import SetupExplanation from "./SetupExplanation";
import PlotRanking from "./PlotRanking";
import PlotAllFeatures from "./PlotAllFeatures";
import PlotFeature from "./PlotFeature";
import ConfigurePlots from "./ConfigurePlots";

function Explainer(props) {
  return (
    <div id="explainer">
      <SetupExplanation endpoint="explain_with_mean" />
      <div className="config">
        <ConfigurePlots />
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

export default Explainer;
