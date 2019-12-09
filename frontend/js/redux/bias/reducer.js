import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import API from "../../api";
import {
  getQuantitativeXCols,
  getQualitativeXCols,
  getPredYCols,
  getFile,
  isRegression
} from "../dataset/selectors"; 

const _loadPlots = createAction("BIAS/LOAD_PLOTS");
export const selectFeature = createAction("BIAS/SELECT_FEATURE");
export const selectLabel = createAction("BIAS/SELECT_LABEL");
export const clear = createAction("BIAS/CLEAR");
export const view = (payload) => {
  return function(dispatch, getState) {
    const state = getState();
    const quantitativeFeatures = getQuantitativeXCols(state).toArray();
    const qualitativeFeatures = getQualitativeXCols(state).toArray();
    const labels = getPredYCols(state).toArray();
    const isRegression_ = isRegression(state);

    payload = payload || {};
    const feature = payload.feature || quantitativeFeatures[0] || qualitativeFeatures[0];
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
    form.append("quantitative_cols", new Blob(
      [JSON.stringify(quantitativeFeatures)],
      { type: "application/json" }
    ));
    form.append("qualitative_cols", new Blob(
      [JSON.stringify(qualitativeFeatures)],
      { type: "application/json" }
    ));
    if (isRegression_) {
      form.append("is_regression", "");
    }

    API.post("plot_influence", form)
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
