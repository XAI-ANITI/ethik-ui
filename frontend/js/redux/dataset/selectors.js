import { OrderedSet, Map } from "immutable";

import { URLS, EXPLANATION_VIEWS } from "../../constants";

export const isLoaded = state =>
  state && state.dataset ? state.dataset.columns.size > 0 : false;

export const isConfigured = state =>
  state && state.dataset ? state.dataset.predYCols.size > 0 : false;

export const getName = state =>
  state && state.dataset ? state.dataset.name : "";

export const getFile = state =>
  state && state.dataset ? state.dataset.file : null;

export const getColumns = state =>
  state && state.dataset ? state.dataset.columns : new OrderedSet();

export const getTrueYCol = state =>
  state && state.dataset ? state.dataset.trueYCol : null;

export const getPredYCols = state =>
  state && state.dataset ? state.dataset.predYCols : new OrderedSet();

export const getQuantitativeXCols = state =>
  state && state.dataset ? state.dataset.quantitativeXCols: new OrderedSet();

export const getQualitativeXCols = state =>
  state && state.dataset ? state.dataset.qualitativeXCols: new OrderedSet();

export const getFeaturesCols = state =>
  getQuantitativeXCols(state).union(getQuantitativeXCols(state));

export const getAllowedExplanationViews = state => {
  if (!state || !state.dataset) return new Map();
  let allowed = EXPLANATION_VIEWS;
  if (!state.dataset.trueYCol) {
    allowed = allowed.delete(URLS.get("EXPLAIN_PERFORMANCE"));
  }
  return allowed;
};
