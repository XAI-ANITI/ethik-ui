import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import MeanExplanation from "./record";

export const explain = createAction("MEAN_EXPLAINER/EXPLAIN");
export const selectFeatures = createAction("MEAN_EXPLAINER/SELECT_FEATURES");
export const clear = createAction("MEAN_EXPLAINER/CLEAR");

const INITIAL_STATE = new Immutable.Record({
  explanation: new MeanExplanation(),
  selectedFeatures: new Immutable.List(),
});

const MeanExplainerReducer = handleActions(
  {
    [explain]: (state, { payload }) => {
      const explanation = new MeanExplanation(Immutable.fromJS(payload));
      state = state.set("explanation", explanation);
      return handleFeatureSelection(state, [explanation.names.get("features").get(0)]);
    },
    [selectFeatures]: (state, { payload }) =>
      handleFeatureSelection(state, payload.features),
    [clear]: (state, { payload }) => INITIAL_STATE(),
  },
  INITIAL_STATE()
);

const handleFeatureSelection = (state, features) =>
  state.set("selectedFeatures", new Immutable.List(features));

export default MeanExplainerReducer;
