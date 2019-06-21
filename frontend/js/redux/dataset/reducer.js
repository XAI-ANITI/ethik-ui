import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import { Dataset } from "./shared";
import { clear as clearExplainer } from "../explainer/reducer";

const configure = createAction("DATASET/CONFIGURE");

export function load(dataset) {
  return function(dispatch) {
    dispatch(configure(dataset));
    dispatch(clearExplainer());
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
