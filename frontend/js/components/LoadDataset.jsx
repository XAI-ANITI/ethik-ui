require("../../sass/LoadDataset.scss");

import React, { Component } from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { load as loadDataset } from "../redux/dataset/reducer"

class LoadDataset extends Component {
  static propTypes = {
    mimeTypes: PropTypes.arrayOf(PropTypes.string),
    light: PropTypes.bool
  };
  static defaultProps = {
    light: false,
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
    const accept = this.props.mimeTypes ? this.props.mimeTypes.join(", ") : null;
    let className = "dropzone-container";
    if (this.props.light) {
      className += " light";
    }

    return (
      <Dropzone
        onDrop={this.onDrop}
        onDropAccepted={this.onDropAccepted}
        accept={accept}
        multiple={false}
      >
        {({getRootProps, getInputProps}) => (
          <section className={className}>
            <div {...getRootProps({className: "dropzone"})}>
              <input {...getInputProps()} />
              {this.props.children}
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}

export default connect(
  null,
  { loadDataset }
)(LoadDataset);
