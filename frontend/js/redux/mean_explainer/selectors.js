import { Map, List } from "immutable";

export const isDatasetExplained = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.taus.size > 0 : false;

export const getTaus = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.taus : new List();

export const getMeans = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.means : new Map();

export const getAccuracies = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.accuracies : new Map();

export const getFeatureNames = store =>
 store && store.meanExplainer ? store.meanExplainer.explanation.names.get("features") : new List();

export const getSelectedFeatures = store =>
  store && store.meanExplainer ? store.meanExplainer.selectedFeatures : new List();

export const getYName = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.names.get("y") : "y";

export const getYPredName = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.names.get("yPred") : "yPred";
