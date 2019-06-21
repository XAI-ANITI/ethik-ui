import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import API from "../../api";
import { PLOT_MODES, Explanation, getAllowedPlotModes } from "./shared";

const _setPlotMode = createAction("EXPLAINER/SET_PLOT_MODE");
const _loadPlots = createAction("EXPLAINER/LOAD_PLOTS");
const _loadExplanation = createAction("EXPLAINER/LOAD_EXPLANATION");
export const selectFeature = createAction("EXPLAINER/SELECT_FEATURE");
export const clear = createAction("EXPLAINER/CLEAR");
export const explain = (explanation) => {
  return function(dispatch) {
    new Promise((resolve, reject) => {
      dispatch(_loadExplanation({ explanation }));
      resolve();
    }).then(
      () => dispatch(selectPlotMode(PLOT_MODES.get("PREDICTIONS")))
    );
  };
};
export const selectPlotMode = (mode) => {
  return function(dispatch, getState) {
      if (!getAllowedPlotModes(getState().explainer).includes(mode)) {
        return;
      }
      dispatch(_setPlotMode({ mode }));

      let endpoint;
      if (mode == PLOT_MODES.get("PREDICTIONS")) endpoint = "plot_predictions";
      else if (mode == PLOT_MODES.get("METRIC")) endpoint = "plot_metric";

      API.post(endpoint)
      .then((res) => dispatch(_loadPlots({
        mode,
        plots: res.data,
      })))
      .catch(function (e) {
        // TODO
        alert("Errooooor: " + e);
      });
  };
};

const INITIAL_STATE = new Immutable.Record({
  explanation: new Explanation(),
  selectedFeature: null,
  plotMode: null,
});

const ExplainerReducer = handleActions(
  {
    [_loadExplanation]: (state, { payload }) => {
      const explanation = new Explanation(Immutable.fromJS(payload.explanation));
      return state.set("explanation", explanation);
    },
    [selectFeature]: (state, { payload }) => {
      if (!state.explanation.featureNames.has(payload.feature)) {
        return state;
      }
      return state.set("selectedFeature", payload.feature);
    },
    [_setPlotMode]: (state, { payload }) => {
      return state.set("plotMode", payload.mode);
    },
    [_loadPlots]: (state, { payload }) => {
      return state.setIn(
        ["explanation", "plots", payload.mode],
        Immutable.fromJS(payload.plots)
      );
    },
    [clear]: (state, { payload }) => INITIAL_STATE(),
  },
  INITIAL_STATE()
);

export default ExplainerReducer;
