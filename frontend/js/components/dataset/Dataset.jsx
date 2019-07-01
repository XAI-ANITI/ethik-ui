import React from "react";
import { connect } from "react-redux";

import { isCurrentView } from "../../redux/app/selectors";
import { isLoaded, isConfigured } from "../../redux/dataset/selectors";

import Configure from "./Configure";
import Load from "./Load";

function Dataset(props) {
  if (!props.isViewed) {
    return null;
  }

  return (
    <div id="dataset_wrapper">
      {!props.isLoaded &&
        <Load mimeTypes={["text/csv"]}>
          <p>Drag and drop a CSV file or click to select one.</p>
        </Load>
      }
      {props.isLoaded && !props.isConfigured &&
        <Configure checkEndpoint="check_dataset" />
      }
    </div>
  );
}

export default connect(
  state => ({
    isViewed: isCurrentView(state, "DATASET"), 
    isLoaded: isLoaded(state),
    isConfigured: isConfigured(state),
  }),
)(Dataset);
