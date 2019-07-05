import { combineReducers } from "redux";

import DatasetReducer from "./dataset/reducer";
import BiasReducer from "./bias/reducer";
import PerformanceReducer from "./performance/reducer";

export default combineReducers({
  dataset: DatasetReducer,
  bias: BiasReducer,
  performance: PerformanceReducer,
});
