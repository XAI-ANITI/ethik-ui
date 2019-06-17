import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import { Dataset } from "./shared";
import { clear as clearMeanExplainer } from "../mean_explainer/reducer";

const configure = createAction("DATASET/CONFIGURE");

export function load(dataset) {
  return function(dispatch) {
    dispatch(configure(dataset));
    dispatch(clearMeanExplainer());
  }
}

const INITIAL_STATE = Dataset;

const DatasetReducer = handleActions(
  {
    [configure]: (state, { payload }) => {
      return new Dataset(Immutable.fromJS(payload));
    }
  },
  INITIAL_STATE()
);

export default DatasetReducer;
