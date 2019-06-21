require("../../sass/Explainer.scss");
import React from "react";

import SetupExplanation from "./SetupExplanation";
import PlotRanking from "./PlotRanking";
//import PlotMeanExplanation from "./PlotMeanExplanation";

function Explainer(props) {
  return (
    <div id="explainer">
      <SetupExplanation endpoint="explain_with_mean" />
      <PlotRanking endpoint="plot_importances" />
    </div>
  );
}

export default Explainer;
