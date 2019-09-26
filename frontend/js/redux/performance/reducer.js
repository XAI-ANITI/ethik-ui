import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import API from "../../api";
import {
  getQuantitativeXCols,
  getQualitativeXCols,
  getPredYCols,
  getTrueYCol,
  getFile,
  isRegression
} from "../dataset/selectors"; 

const _loadPlots = createAction("PERFORMANCE/LOAD_PLOTS");
export const selectFeature = createAction("PERFORMANCE/SELECT_FEATURE");
export const clear = createAction("PERFORMANCE/CLEAR");
export const view = (payload) => {
  return function(dispatch, getState) {
    const state = getState();
    const quantitativeFeatures = getQuantitativeXCols(state).toArray();
    const qualitativeFeatures = getQualitativeXCols(state).toArray();
    const predLabels = getPredYCols(state).toArray();
    const trueLabel = getTrueYCol(state);
    const isRegression_ = isRegression(state);

    if (!trueLabel) {
      return;
    }

    payload = payload || {};
    const feature = payload.feature || quantitativeFeatures[0] || qualitativeFeatures[0];

    dispatch(selectFeature({ feature }));

    if (state.performance.plots !== null) {
      return;
    }

    const form = new FormData();
    form.append("file", getFile(state));
    form.append("pred_y_cols", new Blob(
      [JSON.stringify(predLabels)],
      { type: "application/json" }
    ));
    form.append("true_y_col", trueLabel);
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

    API.post("plot_performance", form)
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
  plots: null,
});

const PerformanceReducer = handleActions(
  {
    [selectFeature]: (state, { payload }) => {
      // TODO: check if feature exists
      return state.set("selectedFeature", payload.feature);
    },
    [_loadPlots]: (state, { payload }) => {
      return state.set("plots", new Immutable.fromJS(payload.plots));
    },
    [clear]: (state, { payload }) => INITIAL_STATE(),
  },
  INITIAL_STATE()
);

export default PerformanceReducer;
