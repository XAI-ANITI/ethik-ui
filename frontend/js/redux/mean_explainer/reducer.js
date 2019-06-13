import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import MeanExplanation from "./record";

export const explain = createAction("MEAN_EXPLAINER/EXPLAIN");
export const selectFeature = createAction("MEAN_EXPLAINER/SELECT_FEATURE");
export const clear = createAction("MEAN_EXPLAINER/CLEAR");

const INITIAL_STATE = new Immutable.Record({
  explanation: new MeanExplanation(),
  selectedFeature: "",
});

const MeanExplainerReducer = handleActions(
  {
    [explain]: (state, { payload }) => {
      const explanation = new MeanExplanation(Immutable.fromJS(payload));
      state = state.set("explanation", explanation);
      return handleFeatureSelection(state, explanation.features.get(0));
    },
    [selectFeature]: (state, { payload }) =>
      handleFeatureSelection(state, payload.feature),
    [clear]: (state, { payload }) => INITIAL_STATE(),
  },
  INITIAL_STATE()
);

const handleFeatureSelection = (state, feature) => state.set("selectedFeature", feature);

export default MeanExplainerReducer;
