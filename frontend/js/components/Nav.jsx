import React from "react";
import { connect } from "react-redux";

import { getView } from "../redux/app/selectors";
import { changeView } from "../redux/app/reducer";

function Nav(props) {
  if (!props.datasetName || !props.views.size || !props.views.has(props.view)) {
    return null;
  }

  const handleChange = (e) => props.changeView({ view: e.target.value });

  let viewElement = props.view;
  if (props.views.size > 1) {
    viewElement = (<select value={props.view} onChange={handleChange}>
      {props.views.toArray().map(
        name => <option key={name} value={name}>{name}</option>
      )}
    </select>);
  }

  return (
    <>
      Explain {viewElement} on <span className="dataset">{props.datasetName}</span>
    </>
  );
}

export default connect(
  state => ({
    view: getView(state),
  }),
  { changeView }
)(Nav);
