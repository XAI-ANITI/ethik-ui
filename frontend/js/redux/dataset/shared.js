import { Record, List } from "immutable";

export const Dataset = new Record({
  name: "",
  file: null,
  columns: new List(),
});
