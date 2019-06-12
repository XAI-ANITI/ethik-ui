require("../../sass/Header.scss");

import React from "react";
import FontAwesome from "react-fontawesome";

import DisplayDataset from "./DisplayDataset";
import LoadDataset from "./LoadDataset";

function Header(props) {
  return (
    <header>
      <h1>Ethik</h1>
      <div className="dataset-wrapper">
        <DisplayDataset />
      </div>
      <LoadDataset mimeTypes={["text/csv"]} light={true}>
        <FontAwesome
          name="cloud-upload-alt"
          size="2x"
        />
      </LoadDataset>
    </header>
  );
}

export default Header;
