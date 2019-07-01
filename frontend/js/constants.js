import { Map } from "immutable";

export const URLS = new Map({
  "LOAD_DATASET": "/dataset/load",
  "CONFIGURE_DATASET": "/dataset/configure",
  "EXPLAIN_BIAS": "/explain/bias",
  "EXPLAIN_PERFORMANCE": "/explain/performance",
});

export const EXPLANATION_VIEWS = new Map({
  [URLS.get("EXPLAIN_BIAS")]: "bias",
  [URLS.get("EXPLAIN_PERFORMANCE")]: "performance"
});
