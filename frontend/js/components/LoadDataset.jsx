require("../../sass/LoadDataset.scss");

import React, { Component } from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import { connect } from 'react-redux'

import { load as loadDataset } from "../redux/dataset/reducer"
import { getName as getDatasetName } from "../redux/dataset/selectors"

class LoadDataset extends Component {
  static propTypes = {
    mimeTypes: PropTypes.arrayOf(PropTypes.string)
  };

  constructor(props) {
    super(props);
    this.state = { files: [] };
  }

  onDrop = (files) => {
    this.setState({files});
  }

  onDropAccepted = (files) => {
    const file = files[0];
    this.props.loadDataset({ name: file.name, file: file });
  }

  render() {
    if (this.props.isDatasetLoaded) {
      return null;
    }

    const accept = this.props.mimeTypes ? this.props.mimeTypes.join(", ") : null;

    return (
      <Dropzone
        onDrop={this.onDrop}
        onDropAccepted={this.onDropAccepted}
        accept={accept}
        multiple={false}
      >
        {({getRootProps, getInputProps}) => (
          <section className="dropzone-container">
            <div {...getRootProps({className: "dropzone"})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}

export default connect(
  state => ({ isDatasetLoaded: getDatasetName(state) != "" }),
  { loadDataset }
)(LoadDataset)
