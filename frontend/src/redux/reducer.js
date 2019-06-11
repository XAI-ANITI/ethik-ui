import { combineReducers } from "redux";

import DatasetReducer from "./dataset/reducer";
import MeanExplainerReducer from "./mean_explainer/reducer";

export default combineReducers({
  dataset: DatasetReducer,
  meanExplainer: MeanExplainerReducer,
});
