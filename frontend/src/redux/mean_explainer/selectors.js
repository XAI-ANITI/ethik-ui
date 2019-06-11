export const getTaus = store => 
  store && store.meanExplainer ? store.meanExplainer.taus : [];
