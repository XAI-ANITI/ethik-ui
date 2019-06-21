import { Map, List } from "immutable";

import { getAllowedPlotModes as getAllowedPlotModes_ } from "./shared";

export const isDatasetExplained = store => {
  return store && store.explainer ? store.explainer.explanation.featureNames.size > 0 : false;
}

export const getFeatureNames = store =>
 store && store.explainer ? store.explainer.explanation.featureNames : new List();

export const getSelectedFeature = store =>
  store && store.explainer ? store.explainer.selectedFeature : null;

export const getYName = store =>
  store && store.explainer ? store.explainer.explanation.yName : "";

export const getYPredName = store =>
  store && store.explainer ? store.explainer.explanation.yPredName : "yPred";

export const getPlotMode = store =>
  store && store.explainer ? store.explainer.plotMode : null;

export const getAllowedPlotModes = store => {
  if (!store || !store.explainer) return new List();
  return getAllowedPlotModes_(store.explainer);
};

export const getRankingPlot = store => {
  const mode = getPlotMode(store);
  const plots = store.explainer.explanation.plots.get(mode);
  if (!store || !store.explainer || !plots) return null;
  return plots.get("ranking");
};
