import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FontAwesome from "react-fontawesome";
import { OrderedSet, Map } from "immutable";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Dustbin from "./Dustbin";
import Box from "./Box";
import API from "../../api";
import { configure } from "../../redux/dataset/reducer";
import { getColumns } from "../../redux/dataset/selectors";

function Configure(props) {
  const [isChecking, setIsChecking] = useState(false);
  const [isRegression, setIsRegression] = useState(false);
  const [columns, setColumns] = useState(new Map({
    "excluded": new OrderedSet(),
    "categorical": new OrderedSet(),
    "numeric": new OrderedSet(props.columns.butLast()),
    "predicted": new OrderedSet([props.columns.last()]),
    "true": null,
  }));

  const handleProblemTypeChange = (e) => {
    // TODO: if regression, we can have one predicted column only
    setIsRegression(event.target.value);
  };

  const renderDustbin = (name, title) => {
    if (title === undefined) {
      title = name.charAt(0).toUpperCase() + name.slice(1);
    }
    return (
      <Dustbin
        name={title}
        key={name}
        onDrop={item => handleDrop(name, item)}
      >
        {renderBoxes(columns.get(name))}
      </Dustbin>
    );
  };

  const renderDustbinGroup = (title, columns, className = "") => {
    const binTitle = columns.length == 1 ? "" : undefined;
    className += " dustbin_group";
    return (
      <div className={className}>
        <p className="title">{title}</p>
        <div className="dustbins">
          {columns.map(name => renderDustbin(name, binTitle))}
        </div>
      </div>
    );
  };

  const configure = () => {
    setIsChecking(true);
    const cols = {
      quantitative_x_cols: columns.get("numeric").toJS(),
      qualitative_x_cols: columns.get("categorical").toJS(),
      pred_y_cols: columns.get("predicted").toJS(),
      true_y_col: columns.get("true"),
    };

    API.post(props.checkEndpoint, cols)
    .then(function (res) {
      setIsChecking(false);

      const errors = res.data.errors;
      if (errors.length) {
        alert(errors); // TODO
        return;
      }

      props.configure({
        trueYCol: cols.true_y_col,
        predYCols: cols.pred_y_cols,
        quantitativeXCols: cols.quantitative_x_cols,
        qualitativeXCols: cols.qualitative_x_cols,
        isRegression: isRegression,
      });
    })
    .catch(function (e) {
      // TODO
      alert("Errorrrrr: " + e);
    });
  };

  const handleDrop = useCallback(
    (groupKey, item) => {
      const col = item.name;
      let newColumns = columns;
      let group;

      // Remove col from previous group
      for (let k of  columns.keySeq()) {
        group = columns.get(k);
        if (OrderedSet.isOrderedSet(group) && group.includes(col)) {
          newColumns = newColumns.set(k, group.delete(col));
        }
        else if (group == col) {
          newColumns = newColumns.set(k, null); 
        }
      }

      // Add col to new group
      group = columns.get(groupKey);
      if (OrderedSet.isOrderedSet(group)) {
        newColumns = newColumns.set(groupKey, group.add(col));
      }
      else {
        if (group !== null) {
          newColumns = newColumns.set(
            "excluded",
            newColumns.get("excluded").add(group)
          );
        }
        newColumns = newColumns.set(groupKey, col);
      }

      setColumns(newColumns);
    },
    [columns]
  );

  if (isChecking) {
    return (
      <div className="spinner">
        <FontAwesome
          name="spinner"
          size="4x"
          spin
        />
      </div>
    );
  }

  const renderBoxes = (group) => {
    if (OrderedSet.isOrderedSet(group)) {
      return group.toArray().map(
        name => <Box name={name} key={name} />
      );
    }
    if (group === null) {
      return null;
    }
    // group is true y
    return <Box name={group} key={group} />
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <form className="configure" onSubmit={configure}>
        <div className="dnd">
          {renderDustbinGroup("Excluded", ["excluded"], "excluded")} 
          {renderDustbinGroup("X", ["numeric", "categorical"])} 
          {renderDustbinGroup("y", ["predicted", "true"])} 
        </div>
        <div className="problem_type">
          <label>Problem type:</label>
          <select value={isRegression} onChange={handleProblemTypeChange}>
              <option value={false}>classification</option>
              <option value={true}>regression</option>
          </select>
        </div>
        <input type="submit" value="Explain" />
      </form>
    </DndProvider>
  );
}

Configure.propTypes = {
  checkEndpoint: PropTypes.string.isRequired,
};

export default connect(
  state => ({
    columns: getColumns(state),
  }),
  { configure }
)(Configure);
