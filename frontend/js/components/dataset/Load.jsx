import React, { useState } from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { changeView } from "../../redux/app/reducer"
import { VIEWS } from "../../redux/app/shared"
import { load as loadDataset } from "../../redux/dataset/reducer"
import { readColumns } from "../../utils/dataset";

function Load(props) {
  const onDropAccepted = (files) => {
    const file = files[0];
    readColumns(file, (cols) => props.loadDataset({
      name: file.name,
      file: file,
      columns: cols,
    }));
    props.changeView({ view: VIEWS.get("DATASET") });
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

Load.propTypes = {
  mimeTypes: PropTypes.arrayOf(PropTypes.string),
  light: PropTypes.bool
};
Load.defaultProps = {
  light: false,
};

export default connect(
  null,
  { loadDataset, changeView }
)(Load);
