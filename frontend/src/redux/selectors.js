export const getTaus = store =>
  store && store.meanExplanation ? store.meanExplanation.taus : [];
