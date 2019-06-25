import { OrderedSet } from "immutable";

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
