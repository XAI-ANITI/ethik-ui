import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import API from "../../api";
import { getFeaturesCols, getPredYCols, getFile } from "../dataset/selectors"; 

const _loadPlots = createAction("BIAS/LOAD_PLOTS");
export const selectFeature = createAction("BIAS/SELECT_FEATURE");
export const selectLabel = createAction("BIAS/SELECT_LABEL");
export const clear = createAction("BIAS/CLEAR");
export const view = (payload) => {
  return function(dispatch, getState) {
    const state = getState();
    const features = getFeaturesCols(state).toArray();
    const labels = getPredYCols(state).toArray();

    payload = payload || {};
    const feature = payload.feature || features[0];
    const label = payload.label || labels[0];

    dispatch(selectFeature({ feature }));
    dispatch(selectLabel({ label }));

    if (state.bias.plots !== null) {
      return;
    }

    const form = new FormData();
    form.append("file", getFile(state));
    form.append("pred_y_cols", new Blob(
      [JSON.stringify(labels)],
      { type: "application/json" }
    ));
    form.append("features_cols", new Blob(
      [JSON.stringify(features)],
      { type: "application/json" }
    ));

    API.post("plot_bias", form)
    .then(
      (res) => dispatch(_loadPlots({ plots: res.data }))
    )
    .catch(function (e) {
      // TODO
      alert("Errooooor: " + e);
    });
  };
};

const INITIAL_STATE = new Immutable.Record({
  selectedFeature: null,
  selectedLabel: null,
  plots: null,
});

const BiasReducer = handleActions(
  {
    [selectFeature]: (state, { payload }) => {
      // TODO: check if feature exists
      return state.set("selectedFeature", payload.feature);
    },
    [selectLabel]: (state, { payload }) => {
      return state.set("selectedLabel", payload.label);
    },
    [_loadPlots]: (state, { payload }) => {
      return state.set("plots", new Immutable.fromJS(payload.plots));
    },
    [clear]: (state, { payload }) => INITIAL_STATE(),
  },
  INITIAL_STATE()
);

export default BiasReducer;
