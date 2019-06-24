import { Record, Map, List } from "immutable";

export const PLOT_MODES = new Map({
  PREDICTIONS: "predictions",
  METRIC: "metric",
});

const _buildPlotsMap = () => {
  return PLOT_MODES.mapEntries(
    ([ k, v ]) => [v, null]
  );
};

export const Explanation = new Record({
  featureNames: new List(),
  yName: "",
  yPredName: "",
  plots: _buildPlotsMap(),
});

export const getAllowedPlotModes = (state) => {
  let allowed = PLOT_MODES;
  if (!state.explanation.yName) {
    allowed = allowed.delete("METRIC");
  }
  return allowed.toList();
};
