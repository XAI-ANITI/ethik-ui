import { Record, List } from "immutable";

const Dataset = new Record({
  name: "",
  file: null,
  columns: new List(),
});

export default Dataset;
