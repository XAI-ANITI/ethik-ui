require("../../sass/Header.scss");

import React from "react";
import FontAwesome from "react-fontawesome";
import { connect } from "react-redux"

import { getName as getDatasetName } from "../redux/dataset/selectors";
import { getAllowedViews } from "../redux/app/selectors";
import { VIEWS } from "../redux/app/shared";
import LoadDataset from "./dataset/Load";
import Nav from "./Nav";

function Header(props) {
  const viewsList = props.allowedViews.remove(VIEWS.get("DATASET"));
  return (
    <header>
      <h1>
        <a href="/">Ethik</a>
      </h1>
      <div className="nav">
        {props.datasetName &&
          <Nav datasetName={props.datasetName} views={viewsList} />
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
    allowedViews: getAllowedViews(state),
  })
)(Header);
