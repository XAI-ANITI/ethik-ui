import { createAction, handleActions } from "redux-actions";
import { Record } from "immutable";

import { VIEWS } from "./shared";

export const changeView = createAction("APP/CHANGE_VIEW");

const INITIAL_STATE = new Record({
  view: VIEWS.get("DATASET"),
});

const AppReducer = handleActions(
  {
    [changeView]: (state, { payload }) => {
      // TODO: check if allowed
      return state.set("view", payload.view);
    }
  },
  INITIAL_STATE()
);

export default AppReducer;
