import { Record, Map, List } from "immutable";

export const PLOT_MODES = new Map({
  PREDICTIONS: "predictions",
  SCORES: "scores",
});

export const MeanExplanation = new Record({
  featureNames: new List(),
  yName: "",
  yPredName: "",
});

export const getAllowedPlotModes = (state) => {
  let allowed = PLOT_MODES;
  if (!state.explanation.yName) {
    allowed = allowed.delete("SCORES");
  }
  return allowed.toList();
};
