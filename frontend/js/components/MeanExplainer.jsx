require("../../sass/MeanExplainer.scss");
import React from "react";

import ExplainWithMean from "./ExplainWithMean";
import DisplayMeanExplanation from "./DisplayMeanExplanation";
import PlotMeanExplanation from "./PlotMeanExplanation";

function MeanExplainer(props) {
  return (
    <div id="mean_explainer">
      <ExplainWithMean endpoint="explain_with_mean" />
      <DisplayMeanExplanation />
      <PlotMeanExplanation />
    </div>
  );
}

export default MeanExplainer;
