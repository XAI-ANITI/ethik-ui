import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Header from "./Header";
import ConfigureDataset from "./dataset/Configure";
import LoadDataset from "./dataset/Load";
import Performance from "./performance/Performance";
import Bias from "./bias/Bias";

import { URLS } from "../constants";
import {
  isLoaded as isDatasetLoaded,
  isConfigured as isDatasetConfigured
} from "../redux/dataset/selectors";

function App(props) {
  return (
    <BrowserRouter>
      <Header />

      <Route exact path="/" render={() => {
        if (!props.isDatasetLoaded) {
          return <Redirect to={URLS.get("LOAD_DATASET")} />;
        }
        else if(!props.isDatasetConfigured) {
          return <Redirect to={URLS.get("CONFIGURE_DATASET")} />;
        }
        return <Redirect to={URLS.get("EXPLAIN_BIAS")} />;
      }} />

      <Route path={URLS.get("LOAD_DATASET")} exact render={() => (
        <div id="load_dataset" className="page">
          <LoadDataset mimeTypes={["text/csv"]}>
            <p>Drag and drop a CSV file or click to select one.</p>
          </LoadDataset>
        </div>
      )} />

      <Route path={URLS.get("CONFIGURE_DATASET")} exact render={() => {
        if (!props.isDatasetLoaded) {
          return <Redirect to={URLS.get("LOAD_DATASET")} />;
        }
        else if (props.isDatasetConfigured) {
          return <Redirect to="/" />;
        }
        return (
          <div id="configure_dataset" className="page">
            <ConfigureDataset checkEndpoint="check_dataset" />
          </div>
        );
      }} />
      
      <Route path={URLS.get("EXPLAIN_BIAS")} exact render={() => (
        !props.isDatasetConfigured ? (
          <Redirect to={URLS.get("CONFIGURE_DATASET")} /> 
        ) : (
          <div id="explain_bias" className="page">
            <Bias />
          </div>
        )
      )} />
      
      <Route path={URLS.get("EXPLAIN_PERFORMANCE")} exact render={() => (
        !props.isDatasetConfigured ? (
          <Redirect to={URLS.get("CONFIGURE_DATASET")} /> 
        ) : (
          <div id="explain_performance" className="page">
            <Performance />
          </div>
        )
      )} />
    </BrowserRouter>
  );
}

export default connect(
  state => ({
    isDatasetLoaded: isDatasetLoaded(state),
    isDatasetConfigured: isDatasetConfigured(state),
  }),
)(App);
