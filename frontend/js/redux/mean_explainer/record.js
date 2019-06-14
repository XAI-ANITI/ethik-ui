import { Record, Map, List } from "immutable";

const MeanExplanation = new Record({
  taus: new List(),
  means: new Map(),
  accuracies: new Map(),
  names: new Map({
    features: new List(),
    y: null,
    yPred: null,
  }),
});

export default MeanExplanation;
