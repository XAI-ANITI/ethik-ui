import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import { URLS } from "../../constants";
import { clear as clearBias } from "../bias/reducer";

const _load = createAction("DATASET/LOAD");
export function load(payload) {
  return function(dispatch) {
    dispatch(_load(payload));
    dispatch(clearBias());
    payload.history.push(URLS.get("CONFIGURE_DATASET"));
  }
}
export const configure = createAction("DATASET/CONFIGURE");

const INITIAL_STATE = new Immutable.Record({
  name: "",
  file: null,
  columns: new Immutable.OrderedSet(),
  trueYCol: null,
  predYCols: new Immutable.OrderedSet(),
  quantitativeXCols: new Immutable.OrderedSet(),
  qualitativeXCols: new Immutable.OrderedSet(),
  isRegression: null,
});

const DatasetReducer = handleActions(
  {
    [_load]: (state, { payload }) => INITIAL_STATE({
      name: payload.name,
      file: payload.file,
      columns: new Immutable.OrderedSet(payload.columns),
    }),
    [configure]: (state, { payload }) => {
      return state.merge({
        trueYCol: payload.trueYCol,
        predYCols: new Immutable.OrderedSet(payload.predYCols),
        quantitativeXCols: new Immutable.OrderedSet(payload.quantitativeXCols),
        qualitativeXCols: new Immutable.OrderedSet(payload.qualitativeXCols),
        isRegression: payload.isRegression,
      });
    },
  },
  INITIAL_STATE()
);

export default DatasetReducer;
