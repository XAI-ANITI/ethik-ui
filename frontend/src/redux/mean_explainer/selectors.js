export const getTaus = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.taus : [];

export const getMeans = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.means : {};

export const getAccuracies = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.accuracies : {};

export const getFeatures = store => 
  store && store.meanExplainer ? store.meanExplainer.explanation.features : [];

export const getFeature = (store, feature) => 
  store && store.meanExplainer ?
  { means: getMeans(store).get(feature), accuracies: getAccuracies(store).get(feature) } :
  null;

export const getSelectedFeature = store =>
  store && store.meanExplainer ? store.meanExplainer.selectedFeature : "";
