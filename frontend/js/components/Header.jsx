import React from "react";
import { Link } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import { connect } from "react-redux"

import {
  getName as getDatasetName, 
  getAllowedExplanationViews,
} from "../redux/dataset/selectors";
import LoadDataset from "./dataset/Load";
import Nav from "./Nav";

function Header(props) {
  return (
    <header>
      <h1>
        <a href="/">Ethik</a>
      </h1>
      <div className="nav">
        {props.datasetName &&
          <Nav
            datasetName={props.datasetName}
            views={props.allowedExplanationViews}
          />
        }
      </div>
      <LoadDataset mimeTypes={["text/csv"]} light>
        <FontAwesome
          name="cloud-upload-alt"
        />
      </LoadDataset>
    </header>
  );
}

export default connect(
  state => ({
    datasetName: getDatasetName(state),
    allowedExplanationViews: getAllowedExplanationViews(state),
  })
)(Header);
