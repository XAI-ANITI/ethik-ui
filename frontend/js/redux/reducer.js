import { combineReducers } from "redux";

import DatasetReducer from "./dataset/reducer";
import ExplainerReducer from "./explainer/reducer";

export default combineReducers({
  dataset: DatasetReducer,
  explainer: ExplainerReducer,
});
