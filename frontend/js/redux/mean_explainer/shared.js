import { Record, Map, List } from "immutable";

export const PLOT_MODES = new Map({
  PROPORTIONS: "proportion",
  ACCURACIES: "accuracies",
});

export const MeanExplanation = new Record({
  taus: new List(),
  means: new Map(),
  originalMeans: new Map(),
  proportions: new Map(),
  accuracies: new Map(),
  names: new Map({
    features: new List(),
    y: null,
    yPred: null,
  }),
});

export const getAllowedPlotModes = (state) => {
  const accuracies = state.explanation.accuracies;
  let allowed = PLOT_MODES;
  if (!accuracies.size) {
    allowed = allowed.delete("ACCURACIES");
  }
  return allowed.toList();
};
