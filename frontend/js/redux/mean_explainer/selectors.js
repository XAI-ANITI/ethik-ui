import { Map, List } from "immutable";

import { getAllowedPlotModes as getAllowedPlotModes_ } from "./shared";

export const isDatasetExplained = store => {
  return store && store.meanExplainer ? store.meanExplainer.explanation.featureNames.size > 0 : false;
}

export const getFeatureNames = store =>
 store && store.meanExplainer ? store.meanExplainer.explanation.featureNames : new List();

export const getSelectedFeatures = store =>
  store && store.meanExplainer ? store.meanExplainer.selectedFeatures : new List();

export const getYName = store =>
  store && store.meanExplainer ? store.meanExplainer.explanation.yName : "";

export const getYPredName = store =>
  store && store.meanExplainer ? store.meanExplainer.explanation.yPredName : "yPred";

export const getPlotMode = store =>
  store && store.meanExplainer ? store.meanExplainer.plotMode : "";

export const getAllowedPlotModes = store => {
  if (!store || !store.meanExplainer) return new List();
  return getAllowedPlotModes_(store.meanExplainer);
};
