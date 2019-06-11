import { LOAD_MEAN_EXPLANATION } from "../actionTypes";

const initialState = {
  taus: [],
  featureMeans: {},
  accuracies: {},
  featureNames: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_MEAN_EXPLANATION: {
      const { taus, means, accuracies } = action.payload;
      return {
        ...state,
        taus: taus,
        featureMeans: means,
        accuracies: accuracies,
        featureNames: Object.keys(means)
      };
    }
    default:
      return state;
  }
}
