import React, { Component } from "react";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";

import API from "../api";

class DatasetLoader extends Component {
  static propTypes = {
    mimeTypes: PropTypes.arrayOf(PropTypes.string),
    endpoint: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { files: [] };
  }

  onDrop = (files) => {
    this.setState({files});
  }

  onDropAccepted = (files) => {
    const form = new FormData();
    form.append("file", files[0]);

    API.post(this.props.endpoint, form)
    .then(function (res) {
      // TODO
      console.log(res);
    })
    .catch(function (e) {
      // TODO
      alert("Error submitting form! " + e);
    });
  }

  render() {
    const files = this.state.files.map(file => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    ));

    const accept = this.props.mimeTypes ? this.props.mimeTypes.join(", ") : null;

    return (
      <Dropzone
        onDrop={this.onDrop}
        onDropAccepted={this.onDropAccepted}
        accept={accept}
        multiple={false}
      >
        {({getRootProps, getInputProps}) => (
          <section className="container">
            <div {...getRootProps({className: "dropzone"})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <aside>
              <h4>Files</h4>
              <ul>{files}</ul>
            </aside>
          </section>
        )}
      </Dropzone>
    );
  }
}

export default DatasetLoader;
