import { List } from "immutable";

import { VIEWS } from "./shared";

export const getView = state =>
  state && state.app ? state.app.view : null;

export const isCurrentView = (state, name) => getView(state) == VIEWS.get(name);

export const getAllowedViews = state => {
  if (!state || !state.dataset) return new List();
  let allowed = VIEWS;
  if (!state.dataset.trueLabelCol) {
    allowed = allowed.delete("METRIC");
  }
  return allowed.toList();
};
