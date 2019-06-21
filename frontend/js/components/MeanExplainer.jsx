require("../../sass/MeanExplainer.scss");
import React from "react";

import ExplainWithMean from "./ExplainWithMean";
import DisplayMeanExplanation from "./DisplayMeanExplanation";
import PlotImportances from "./PlotImportances";
import PlotMeanExplanation from "./PlotMeanExplanation";

function MeanExplainer(props) {
  return (
    <div id="mean_explainer">
      <ExplainWithMean endpoint="explain_with_mean" />
      <DisplayMeanExplanation />
      <PlotImportances endpoint="plot_importances" />
      <PlotMeanExplanation endpoint="plot_predictions" />
    </div>
  );
}

export default MeanExplainer;
