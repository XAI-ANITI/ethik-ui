import { Map, List } from "immutable";

export const isDatasetExplained = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.features.size > 0 : false;

export const getTaus = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.taus : new List();

export const getMeans = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.means : new Map();

export const getAccuracies = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.accuracies : new Map();

export const getFeatures = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.features : new List();

export const getFeature = (store, feature) => 
  store && store.meanExplainer ?
  { means: getMeans(store).get(feature), accuracies: getAccuracies(store).get(feature) } :
  null;

export const getSelectedFeatures = store =>
  store && store.meanExplainer ? store.meanExplainer.selectedFeatures : new List();
