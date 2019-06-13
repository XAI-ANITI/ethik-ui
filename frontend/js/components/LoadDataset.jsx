require("../../sass/LoadDataset.scss");

import React, { useState } from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { load as loadDataset } from "../redux/dataset/reducer"

function LoadDataset(props) {
  const [files, setFiles] = useState([]);

  const onDrop = (files) => setFiles(files);

  const onDropAccepted = (files) => {
    const file = files[0];
    props.loadDataset({ name: file.name, file: file });
  }

  const accept = props.mimeTypes ? props.mimeTypes.join(", ") : null;
  let className = "dropzone-container";
  if (props.light) {
    className += " light";
  }

  return (
    <Dropzone
      onDrop={onDrop}
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
