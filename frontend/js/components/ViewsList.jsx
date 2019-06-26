import React from "react";
import { connect } from "react-redux";

import { getView } from "../redux/app/selectors";
import { changeView } from "../redux/app/reducer";

function ViewsList(props) {
  if (props.views.size < 2 || !props.views.has(props.view)) {
    return null;
  }

  const handleChange = (e) => props.changeView({ view: e.target.value });

  return (
    <select value={props.view} onChange={handleChange}>
      {props.views.toArray().map(
        name => <option key={name} value={name}>{name}</option>
      )}
    </select>
  );
}

export default connect(
  state => ({
    view: getView(state),
  }),
  { changeView }
)(ViewsList);
