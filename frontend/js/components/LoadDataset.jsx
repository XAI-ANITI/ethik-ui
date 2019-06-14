require("../../sass/LoadDataset.scss");

import React, { useState } from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { load as loadDataset } from "../redux/dataset/reducer"
import { readColumns } from "../utils/dataset";

function LoadDataset(props) {
  const onDropAccepted = (files) => {
    const file = files[0];
    readColumns(file, (cols) => props.loadDataset({
      name: file.name,
      file: file,
      columns: cols,
    }));
  }

  const accept = props.mimeTypes ? props.mimeTypes.join(", ") : null;
  let className = "dropzone-container";
  if (props.light) {
    className += " light";
  }

  return (
    <Dropzone
      onDropAccepted={onDropAccepted}
      accept={accept}
      multiple={false}
    >
      {({getRootProps, getInputProps}) => (
        <section className={className}>
          <div {...getRootProps({className: "dropzone"})}>
            <input {...getInputProps()} />
            {props.children}
          </div>
        </section>
      )}
    </Dropzone>
  );
}

LoadDataset.propTypes = {
  mimeTypes: PropTypes.arrayOf(PropTypes.string),
  light: PropTypes.bool
};
LoadDataset.defaultProps = {
  light: false,
};

export default connect(
  null,
  { loadDataset }
)(LoadDataset);
