import { combineReducers } from "redux";

import AppReducer from "./app/reducer";
import DatasetReducer from "./dataset/reducer";
import PredictionsReducer from "./predictions/reducer";

export default combineReducers({
  app: AppReducer,
  dataset: DatasetReducer,
  predictions: PredictionsReducer,
});
