import { createAction, handleActions } from "redux-actions";

import Dataset from "./record";

export const load = createAction("DATASET/LOAD");

const INITIAL_STATE = new Dataset();

const DatasetReducer = handleActions(
  {
    [load]: (state, { payload }) => {
      return state.set("name", payload.name).set("file", payload.file);
    }
  },
  INITIAL_STATE
);

export default DatasetReducer;
