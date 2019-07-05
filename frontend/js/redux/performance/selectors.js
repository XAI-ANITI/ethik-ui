import { Map, List } from "immutable";

export const getSelectedFeature = state =>
  state && state.performance ? state.performance.selectedFeature : null;

export const isExplained = state =>
  state && state.performance ? state.performance.plots !== null : false;

const _getPlots = (state, keys = null) => {
  if (!state || !state.performance) return null;
  let plots = state.performance.plots;
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
  ["ranking"]
);

export const getAllFeaturesPlot = state => _getPlots(
  state,
  ["all_features"]
);

export const getFeaturePlot = state => _getPlots(
  state,
  ["features", getSelectedFeature(state)]
);
