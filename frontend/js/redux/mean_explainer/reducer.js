import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import { PLOT_MODES, MeanExplanation, getAllowedPlotModes } from "./shared";

export const explain = createAction("MEAN_EXPLAINER/EXPLAIN");
export const selectFeatures = createAction("MEAN_EXPLAINER/SELECT_FEATURES");
export const selectPlotMode = createAction("MEAN_EXPLAINER/SELECT_PLOT_MODE");
export const clear = createAction("MEAN_EXPLAINER/CLEAR");

const INITIAL_STATE = new Immutable.Record({
  explanation: new MeanExplanation(),
  selectedFeatures: new Immutable.List(),
  plotMode: PLOT_MODES.get("PREDICTIONS"),
});

const MeanExplainerReducer = handleActions(
  {
    [explain]: (state, { payload }) => {
      const explanation = new MeanExplanation(Immutable.fromJS(payload));
      state = state.set("explanation", explanation);
      return handleFeatureSelection(state, [explanation.featureNames.get(0)]);
    },
    [selectFeatures]: (state, { payload }) =>
      handleFeatureSelection(state, payload.features),
    [selectPlotMode]: (state, { payload }) => {
      const plotMode = payload.plotMode;
      if (!getAllowedPlotModes(state).includes(plotMode)) {
        return state;
      }
      return state.set("plotMode", plotMode);
    },
    [clear]: (state, { payload }) => INITIAL_STATE(),
  },
  INITIAL_STATE()
);

const handleFeatureSelection = (state, features) =>
  state.set("selectedFeatures", new Immutable.List(features));

export default MeanExplainerReducer;
