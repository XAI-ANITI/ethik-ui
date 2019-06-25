import { Map, List } from "immutable";

export const getSelectedFeature = state =>
  state && state.predictions ? state.predictions.selectedFeature : null;

export const getSelectedLabel = state =>
  state && state.predictions ? state.predictions.selectedLabel : null;

export const isExplained = state =>
  state && state.predictions ? state.predictions.plots !== null : false;

const _getPlots = (state, keys = null) => {
  if (!state || !state.predictions) return null;
  let plots = state.predictions.plots;
  if (!plots) return null;
  keys = keys || [];
  for (let k of keys) {
    if (k === null || plots === undefined) return null;
    plots = plots.get(k);
  }
  return plots;
};

export const getRankingPlot = state => _getPlots(
  state,
  [getSelectedLabel(state), "ranking"]
);

export const getAllFeaturesPlot = state => _getPlots(
  state,
  [getSelectedLabel(state), "all_features"]
);

export const getFeaturePlot = state => _getPlots(
  state,
  [getSelectedLabel(state), "features", getSelectedFeature(state)]
);
