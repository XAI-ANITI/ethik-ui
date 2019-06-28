import { createAction, handleActions } from "redux-actions";
import Immutable from "immutable";

import { clear as clearBias } from "../bias/reducer";

const _load = createAction("DATASET/LOAD");
export function load(dataset) {
  return function(dispatch) {
    dispatch(_load(dataset));
    dispatch(clearBias());
  }
}
export const configure = createAction("DATASET/CONFIGURE");

const INITIAL_STATE = new Immutable.Record({
  name: "",
  file: null,
  columns: new Immutable.OrderedSet(),
  trueLabelCol: null,
  predLabelsCols: new Immutable.OrderedSet(),
  featuresCols: new Immutable.OrderedSet(),
});

const DatasetReducer = handleActions(
  {
    [_load]: (state, { payload }) => INITIAL_STATE({
      name: payload.name,
      file: payload.file,
      columns: new Immutable.OrderedSet(payload.columns),
    }),
    [configure]: (state, { payload }) => {
      const featuresCols = state.columns.subtract(
        payload.predLabelsCols
      ).subtract([
        payload.trueLabelCol
      ]);
      return state.set(
        "trueLabelCol", payload.trueLabelCol
      ).set(
        "predLabelsCols", payload.predLabelsCols
      ).set(
        "featuresCols", featuresCols
      );
    },
  },
  INITIAL_STATE()
);

export default DatasetReducer;
