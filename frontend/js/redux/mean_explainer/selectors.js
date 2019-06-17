import { Map, List } from "immutable";

import { getAllowedPlotModes as getAllowedPlotModes_ } from "./shared";

export const isDatasetExplained = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.taus.size > 0 : false;

export const getTaus = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.taus : new List();

export const getMeans = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.means : new Map();

export const getAccuracies = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.accuracies : new Map();

export const getProportions = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.proportions : new Map();

export const getFeatureNames = store =>
 store && store.meanExplainer ? store.meanExplainer.explanation.names.get("features") : new List();

export const getSelectedFeatures = store =>
  store && store.meanExplainer ? store.meanExplainer.selectedFeatures : new List();

export const getYName = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.names.get("y") : "y";

export const getYPredName = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.names.get("yPred") : "yPred";

export const getPlotMode = store => 
  store && store.meanExplainer ? store.meanExplainer.plotMode : "";

export const getAllowedPlotModes = store => {
  if (!store || !store.meanExplainer) return new List();
  return getAllowedPlotModes_(store.meanExplainer);
};
