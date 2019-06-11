import { LOAD_MEAN_EXPLANATION } from "./actionTypes";

export const loadMeanExplanation = (taus, means, accuracies) => ({
  type: LOAD_MEAN_EXPLANATION,
  payload: { taus, means, accuracies }
});
