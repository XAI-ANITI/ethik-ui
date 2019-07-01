import React from "react";
import { withRouter } from "react-router";

function Nav(props) {
  const url = props.location.pathname;
  if (!props.datasetName || !props.views.size || !props.views.has(url)) {
    return null;
  }

  const handleChange = (e) => props.history.push(e.target.value);

  let viewElement = props.views.get(url);
  if (props.views.size > 1) {
    viewElement = (<select value={url} onChange={handleChange}>
      {props.views.toArray().map(
        ([url, name]) => <option key={name} value={url}>{name}</option>
      )}
    </select>);
  }

  return (
    <>
      Explain {viewElement} on <span className="dataset">{props.datasetName}</span>
    </>
  );
}

export default withRouter(Nav);
