import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import API from "../../api";
import { changeView } from "../app/reducer";
import { VIEWS } from "../app/shared";
import { getFeaturesCols, getPredLabelsCols, getFile } from "../dataset/selectors"; 

const _loadPlots = createAction("PREDICTIONS/LOAD_PLOTS");
export const selectFeature = createAction("PREDICTIONS/SELECT_FEATURE");
export const selectLabel = createAction("PREDICTIONS/SELECT_LABEL");
export const clear = createAction("PREDICTIONS/CLEAR");
export const view = (payload) => {
  return function(dispatch, getState) {
    const state = getState();
    const features = getFeaturesCols(state).toArray();
    const labels = getPredLabelsCols(state).toArray();

    payload = payload || {};
    const feature = payload.feature || features[0];
    const label = payload.label || labels[0];

    dispatch(selectFeature({ feature }));
    dispatch(selectLabel({ label }));

    if (state.predictions.plots !== null) {
      return dispatch(changeView({ view: VIEWS.get("PREDICTIONS") }));
    }

    const form = new FormData();
    form.append("file", getFile(state));
    form.append("pred_labels_cols", new Blob(
      [JSON.stringify(labels)],
      { type: "application/json" }
    ));
    form.append("features_cols", new Blob(
      [JSON.stringify(features)],
      { type: "application/json" }
    ));

    API.post("plot_predictions", form)
    .then(
      (res) => new Promise((resolve, reject) => {
        dispatch(_loadPlots({ plots: res.data }));
        resolve();
      }).then(
        () => dispatch(changeView({ view: VIEWS.get("PREDICTIONS") }))
      )
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

const PredictionsReducer = handleActions(
  {
    [selectFeature]: (state, { payload }) => {
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

export default PredictionsReducer;
