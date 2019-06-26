require("../../sass/Header.scss");

import React from "react";
import FontAwesome from "react-fontawesome";
import { connect } from "react-redux"

import { getName as getDatasetName } from "../redux/dataset/selectors";
import { getAllowedViews } from "../redux/app/selectors";
import { VIEWS } from "../redux/app/shared";
import LoadDataset from "./dataset/Load";
import ViewsList from "./ViewsList";

function Header(props) {
  const viewsList = props.allowedViews.remove(VIEWS.get("DATASET"));
  return (
    <header>
      <h1>
        <a href="/">Ethik</a>
      </h1>
      <div className="dataset">
        {props.datasetName &&
          <span>Dataset: {props.datasetName}</span>
        }
      </div>
      <div className="views_list">
        <ViewsList views={viewsList} />
      </div>
      <LoadDataset mimeTypes={["text/csv"]} light>
        <FontAwesome
          name="cloud-upload-alt"
          size="2x"
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
