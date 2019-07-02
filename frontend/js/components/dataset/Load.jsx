import React, { useState } from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { load as loadDataset } from "../../redux/dataset/reducer"
import { readColumns } from "../../utils/dataset";

function Load(props) {
  const onDropAccepted = (files) => {
    const file = files[0];
    readColumns(file, (cols) => props.loadDataset({
      name: file.name,
      file: file,
      columns: cols,
      history: props.history
    }));
  }

  const accept = props.mimeTypes ? props.mimeTypes.join(", ") : null;
  let className = "dropzone_container";
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

Load.propTypes = {
  mimeTypes: PropTypes.arrayOf(PropTypes.string),
  light: PropTypes.bool
};
Load.defaultProps = {
  light: false,
};

export default withRouter(connect(
  null,
  { loadDataset }
)(Load));
