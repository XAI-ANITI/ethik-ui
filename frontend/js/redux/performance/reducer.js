import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import API from "../../api";
import {
  getFeaturesCols,
  getPredLabelsCols,
  getTrueLabelCol,
  getFile
} from "../dataset/selectors"; 

const _loadPlots = createAction("PERFORMANCE/LOAD_PLOTS");
export const selectFeature = createAction("PERFORMANCE/SELECT_FEATURE");
export const clear = createAction("PERFORMANCE/CLEAR");
export const view = (payload) => {
  return function(dispatch, getState) {
    const state = getState();
    const features = getFeaturesCols(state).toArray();
    const predLabels = getPredLabelsCols(state).toArray();
    const trueLabel = getTrueLabelCol(state);

    if (!trueLabel) {
      return;
    }

    payload = payload || {};
    const feature = payload.feature || features[0];

    dispatch(selectFeature({ feature }));

    if (state.performance.plots !== null) {
      return;
    }

    const form = new FormData();
    form.append("file", getFile(state));
    form.append("pred_labels_cols", new Blob(
      [JSON.stringify(predLabels)],
      { type: "application/json" }
    ));
    form.append("true_label_col", trueLabel);
    form.append("features_cols", new Blob(
      [JSON.stringify(features)],
      { type: "application/json" }
    ));

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
