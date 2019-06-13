import { createAction, handleActions } from "redux-actions";

import Dataset from "./record";
import { clear as clearMeanExplainer } from "../mean_explainer/reducer";

const configure = createAction("DATASET/CONFIGURE");

export function load(dataset) {
  return function(dispatch) {
    dispatch(configure(dataset));
    dispatch(clearMeanExplainer());
  }
}

const INITIAL_STATE = new Dataset();

const DatasetReducer = handleActions(
  {
    [configure]: (state, { payload }) => {
      return state.set("name", payload.name).set("file", payload.file);
    }
  },
  INITIAL_STATE
);

export default DatasetReducer;
