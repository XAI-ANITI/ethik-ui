import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import MeanExplanation from "./record";

export const explain = createAction("MEAN_EXPLAINER/EXPLAIN");

const INITIAL_STATE = new MeanExplanation();

const MeanExplainerReducer = handleActions(
  {
    [explain]: (state, { payload }) => {
      return state.set("taus", Immutable.fromJS(payload.taus))
        .set("means", Immutable.fromJS(payload.means))
        .set("accuracies", Immutable.fromJS(payload.accuracies));
    }
  },
  INITIAL_STATE
);

export default MeanExplainerReducer;
