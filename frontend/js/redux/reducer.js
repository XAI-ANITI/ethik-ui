import { combineReducers } from "redux";

import AppReducer from "./app/reducer";
import DatasetReducer from "./dataset/reducer";
import BiasReducer from "./bias/reducer";

export default combineReducers({
  app: AppReducer,
  dataset: DatasetReducer,
  bias: BiasReducer,
});
