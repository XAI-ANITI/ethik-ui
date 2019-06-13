export const isLoaded = state =>
  state && state.dataset ? state.dataset.file != null : false;

export const getName = state =>
  state && state.dataset ? state.dataset.name : "";
