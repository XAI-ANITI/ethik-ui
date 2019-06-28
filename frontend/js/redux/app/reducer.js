import { createAction, handleActions } from "redux-actions";
import { Record } from "immutable";

import { VIEWS } from "./shared";
import { view as viewBias } from "../bias/reducer";

const _setView = createAction("APP/SET_VIEW");
export const changeView = (payload) => {
  return function(dispatch, getState) {
    // TODO: check if allowed
    if (payload.view == VIEWS.get("BIAS")) {
      dispatch(viewBias(payload));
    }
    dispatch(_setView({ view: payload.view }));
  };
};

const INITIAL_STATE = new Record({
  view: VIEWS.get("DATASET"),
});

const AppReducer = handleActions(
  {
    [_setView]: (state, { payload }) => {
      return state.set("view", payload.view);
    }
  },
  INITIAL_STATE()
);

export default AppReducer;
