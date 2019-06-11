import { Record, Map, List } from "immutable";

const MeanExplanation = new Record({
  taus: new List(),
  means: new Map(),
  accuracies: new Map(),
});

export default MeanExplanation;
