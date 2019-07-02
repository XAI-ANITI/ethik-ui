import { OrderedSet, Map } from "immutable";

import { URLS, EXPLANATION_VIEWS } from "../../constants";

export const isLoaded = state =>
  state && state.dataset ? state.dataset.columns.size > 0 : false;

export const isConfigured = state =>
  state && state.dataset ? state.dataset.predLabelsCols.size > 0 : false;

export const getName = state =>
  state && state.dataset ? state.dataset.name : "";

export const getFile = state =>
  state && state.dataset ? state.dataset.file : null;

export const getColumns = state =>
  state && state.dataset ? state.dataset.columns : new OrderedSet();

export const getTrueLabelCol = state =>
  state && state.dataset ? state.dataset.trueLabelCol : null;

export const getPredLabelsCols = state =>
  state && state.dataset ? state.dataset.predLabelsCols : new OrderedSet();

export const getFeaturesCols = state =>
  state && state.dataset ? state.dataset.featuresCols : new OrderedSet();

export const getAllowedExplanationViews = state => {
  if (!state || !state.dataset) return new Map();
  let allowed = EXPLANATION_VIEWS;
  if (!state.dataset.trueLabelCol) {
    allowed = allowed.delete(URLS.get("EXPLAIN_PERFORMANCE"));
  }
  return allowed;
};
