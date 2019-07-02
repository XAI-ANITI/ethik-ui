import { combineReducers } from "redux";

import DatasetReducer from "./dataset/reducer";
import BiasReducer from "./bias/reducer";

export default combineReducers({
  dataset: DatasetReducer,
  bias: BiasReducer,
});
